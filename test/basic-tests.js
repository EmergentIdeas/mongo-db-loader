var mongoDbLoader = require('../index')
require('mocha')
var expect = require('chai').expect
var assert = require('chai').assert

const Sink = require('file-sink')
let dataSink = new Sink('./test-data')
let wh = require('webhandle')

describe("basic tests for functionality", function() {
	it("simple creation", function(done) {
		process.env.dbs = dataSink.readSync('test1.json')
		
		mongoDbLoader(() => {
			assert(wh.dbs != null)
			assert(wh.dbs['test-2'] != null)
			assert(wh.dbs['test-2'].collections.length != null)
			
			wh.dbs['test-2'].client.close()
			wh.dbs['test1'].client.close()
			done()
		})
	})

	it("write data", function(done) {
		process.env.dbs = dataSink.readSync('test1.json')
		
		mongoDbLoader(() => {
			let first1 = wh.dbs['test1'].collections.first
			let first2 = wh.dbs['test-2'].collections.first
			
			first1.insertOne({ when: new Date(), mgs: 'hello'}, function(err, res) {
				debugger
				wh.dbs['test-2'].client.close()
				wh.dbs['test1'].client.close()
				done(err)
				
			})
			
		})
	})

	
})