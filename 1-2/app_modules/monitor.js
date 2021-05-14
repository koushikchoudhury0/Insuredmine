const osUtils = require("os-utils")

setInterval(() => { osUtils.cpuUsage((v) => {
    //console.log(Number(v*100).toFixed(2))
    if (v*100>35) {
        console.log("Exiting due to CPU Load: ", Number(v*100).toFixed(2), "%")
        process.exit(0)
    }
}) }, 1000)