const MongoClient = require('mongodb').MongoClient;

const filog = require('filter-log')
let log = filog('webhandle:mongo-db-loader')
let wh = require('webhandle')

let counter = 0

let processDb = require('./process-db-info')

let initialize = function(callback) {
	if (process.env.dbs) {
		wh.dbs = wh.dbs || {}
		
		processDb(wh.dbs, process.env.dbs, callback)
	}
	else if (callback) {
		return callback(null, wh.dbs)
	}

}

module.exports = initialize