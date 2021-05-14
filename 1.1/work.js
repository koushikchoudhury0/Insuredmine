let pool = require("./app_modules/workers/WorkerPool")

for (let i=0; i<10; i++) {
    pool.create({
        script: __dirname+"/app_modules/workers/test.js",
        workerData: { },
        onCreate: () => { console.log("Executing") },
        onError: (err, threadId) => { console.log("Error: ", err, "\tfrom Thread: ", threadId) },
        onExit: (threadId) => { console.log("Exited: ", threadId) },
        onMsg: () => { console.log("Message") }
    })
}

console.log("Work.js Ends here")