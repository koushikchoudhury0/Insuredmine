const {isMainThread, parentPort, workerData} = require("worker_threads")
const database = require("../db")

handler()

async function handler() {
    try {
        parentPort.postMessage("Connecting")
        let con = await database.connect()
        parentPort.postMessage("Selecting DB")
        let db = con.db("insuredmine")
        parentPort.postMessage("Dropping: "+workerData.table)
        try {
            await db.collection(workerData.table).drop()
        } catch(err) {  }
        parentPort.postMessage("Creating: "+workerData.table)
        await db.createCollection(workerData.table)
        parentPort.postMessage("Populating: "+workerData.table)
        await db.collection(workerData.table).insertMany(workerData.data)
        parentPort.postMessage("Disconnecting")    
        database.disconnect(con)
    } catch(err) {
        parentPort.postMessage(err)
    }
}