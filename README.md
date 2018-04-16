#Mongo DB Loader

Reads the `process.env.dbs` variable and loads the mongo type databases into
the global webhandle object.

The normal way to use this is to add the db info to the `server.config.js` file
used with pm2 like:

```
module.exports = {
    apps: [{
            name: 'app name',
            script: './web-server.js',
            "env": {
                PORT: 3000,
				dbs: [
					{
						"type": "mongodb",
						"dbName": "test1",
						"url": "mongodb://localhost:27017/",
						"collectionNames": [ "first", "second", "third"]
					}
					,{
						"type": "mongodb",
						"dbName": "test2",
						"url": "mongodb://localhost:27017/",
						"collectionNames": [ "blue", "red", "green"],
						"name": "test-2"
					}
				]
            }
        }
    ]
}

```

It will populate the webhandle.dbs object with a object for each entry in the list.
Each object will have the propertes:

* client: the connection to the mongo server instance
* db: the object which represents the named databases
* collections: an object where there is one collection object with the collection
			name as the key
* dbName: the mongo database name
* name: the user provided name/label/app-unique-name provided. This is the dbName
			if no attribute is specified in the definition
			


