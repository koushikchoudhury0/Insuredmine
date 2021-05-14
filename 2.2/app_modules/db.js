const TAG = "[db.js]"
const MongoClient = require("mongodb").MongoClient
const MongoURI = "mongodb://localhost:27017"

class DatabaseManager {
    constructor() { 
        new MongoClient(MongoURI, { useUnifiedTopology: true })
        .connect()
        .then(connectionPool => { 
            this.connectionPool = connectionPool
            this.startShifting()
        })
    }    

    addMsg(msg) {
        let db = this.connectionPool.db("insuredmine")
        let data = {msg: msg, moment: new Date().getTime()}
        db.collection("C1").insertOne(data)
        setTimeout(() => {
            db.collection("C2").insertOne(data)
        }, 5000)
    }

    async startShifting() {
        /* let db = this.connectionPool.db("insuredmine")
        db.collection("C1").watch({fullDocument: "updateLookup"})
        .on("change", async(change) => {
            setTimeout(() => { db.collection("C2").insertOne(change.fullDocument) }, 1000)
        }) */
        /*Doesnt work due to Replica Set*/
    }
}

/*Simulate Singleton*/
const databaseManager = new DatabaseManager()
//Object.freeze(databaseManager)
module.exports = databaseManager