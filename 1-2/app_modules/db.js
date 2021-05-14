const MongoDB = require("mongodb")
const MongoClient = MongoDB.MongoClient;
const MongoURI = "mongodb://localhost:27017"
const TAG = "[db.js]"
var DB_NAME = "insuremine"


module.exports = {

    connect: () => {
        console.log(TAG, "Establishing New Connection")
        return new Promise((resolve, reject) => {            
            let client = new MongoClient(MongoURI, { useUnifiedTopology: true })
            client.connect((err, connection) => {
                if (err) {
                    console.log(TAG, "Failed to Connect with error: ", err)
                    reject(err)
                } else {
                    console.log(TAG, "Connected to Database")                 
                    resolve(connection)
                }
            })
        })
    },

    disconnect: (connection) => {
        console.log(TAG, "Disconnecting a Connection")
        return new Promise((resolve, reject) => {
            try {
                connection.close()
                resolve()
            } catch(err) {
                console.log("Failed to Close Connection: ", err)
                reject(err)
            }
        })
    }

}