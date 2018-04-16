const MongoClient = require('mongodb').MongoClient;

const filog = require('filter-log')
let log = filog('webhandle:mongo-db-loader')
let wh = require('webhandle')
let commingle = require('commingle')

let counter = 0

let initialize = function(callback) {
	if (process.env.dbs) {
		wh.dbs = wh.dbs || {}
		let loaders = []
		
		if (typeof process.env.dbs == 'string') {
			try {
				let dbDefs = JSON.parse(process.env.dbs)
				if (Array.isArray(dbDefs)) {
					dbDefs.forEach((current) => {
						if (current.type == 'mongodb') {
							let db = {
								dbName: current.dbName,
								collections: []
							}
							let dbName = current.name || current.dbName || 'db' + new Date().getTime() + counter++
							wh.dbs[dbName] = db
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
				return commingle(loaders)(null, null, () => callback(null, wh.dbs))
			}
		}
	}
	if (callback) {
		return callback(null, wh.dbs)
	}

}

module.exports = initialize