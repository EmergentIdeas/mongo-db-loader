const MongoClient = require('mongodb').MongoClient;

const filog = require('filter-log')
let log = filog('webhandle:mongo-db-loader')
let commingle = require('commingle')

let counter = 0

let initialize = function(globalEnv, configString, callback) {
	if (configString) {
		
		let loaders = []
		
		if (typeof configString == 'string') {
			try {
				let dbDefs = JSON.parse(configString)
				if (Array.isArray(dbDefs)) {
					dbDefs.forEach((current) => {
						if (current.type == 'mongodb') {
							let db = {
								dbName: current.dbName,
								collections: []
							}
							let dbName = current.name || current.dbName || 'db' + new Date().getTime() + counter++
							globalEnv[dbName] = db
							db.name = dbName

							loaders.push((one, two, next) => {
								// Use connect method to connect to the server
								MongoClient.connect(current.url, function(err, client) {
									if (err) {
										log.error("Could not connect to mongo db:" + current.dbName)
										log.error(err)
									} else {
										log.info("Connected successfully to mongodb server: " + current.dbName)
									}
									db.client = client
									db.db = client.db(current.dbName)

									if(current.collectionNames) {
										current.collectionNames.forEach((current) => {
											db.collections[current] = db.db.collection(current)
										})
									}
									
									log.info("Created connection to mongo database connection: " + dbName)
									next()
								})
							})
						}
					})
				}
			} catch (e) {
				log.error('Could not parse db options: ' + e.message)
				if (callback) {
					return callback(e)
				}
			}
			
			if(loaders.length > 0) {
				return commingle(loaders)(null, null, () => callback(null, globalEnv))
			}
		}
	}
	else {
		if(callback) {
			callback()
		}
	}
}

module.exports = initialize