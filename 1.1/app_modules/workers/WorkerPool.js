const {isMainThread, parentPort, workerData, Worker} = require("worker_threads")
const os = require('os')
const CPU_COUNT = os.cpus().length

class WorkerPool {
    constructor() { this.workers = [], this.Q = [] }
    create(config) { this.Q.push(config) }
    getActive() { return this.workers.length }
    getPending() { return this.Q.length }
}

let pool = new WorkerPool()
module.exports = pool

const manage = function() {
    /*Shift from Queued to Executing State*/
    if (pool.workers.length<CPU_COUNT && pool.Q.length>0) {        
        let config = pool.Q.shift()
        let worker = new Worker(config.script, { workerData: config.data })   
        worker.staticThreadId = worker.threadId     
        console.log("Created New Thread: ", worker.threadId)
        if (config.onCreate) worker.on("online", config.onCreate)
        if (config.onExit) worker.on("exit", function() {            
            config.onExit(worker.staticThreadId)
            pool.workers = pool.workers.filter(w => w.id!==worker.staticThreadId)
        })
        if (config.onError) worker.on("error", function(err) {
            config.onError(err, worker.staticThreadId)
            pool.workers = pool.workers.filter(w => w.id!==worker.staticThreadId)
        })
        if (config.onMsg) worker.on("message", config.onMsg)        
        pool.workers.push({id: worker.threadId, thread: worker})
    }
}

/*Infinite Processing*/
setInterval(() => { manage() }, 1)
