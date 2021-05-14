/*Libraries*/
const express = require("express")
const multer = require("multer")
const fs = require("fs")
const {Worker, isMainThread, parentPort, workerData} = require("worker_threads")
const extra = require("./app_modules/extra")
const {"v4": uuidv4} = require("uuid")
let pool = require("./app_modules/workers/WorkerPool")

/*Global Initializations*/
var app = express()
var upload = multer({ dest: 'uploads/' })
var LOADER_PATH = __dirname+"/app_modules/workers/loader.js"

/*Middlewares*/
app.use(express.json())
app.use(express.urlencoded({extended: true}))

/*Request Routing*/
app.post("/load", upload.single("data"), (req, res) => {
    
    /*Read CSV File from Request*/
    let dataStr = fs.readFileSync(req.file.path).toString()
    let dataCSVArr = dataStr.split("\n").filter(d => d.length>0)
    
    /*Extract Headers*/
    let headers = dataCSVArr.shift().split(",")

    /*JSONify*/
    dataJSONArr = extra.CSV2JSON(headers, dataCSVArr)    

    /*Extract Unique Entities*/
    console.log("Forming Data Dumps")
    let gUsers = extra.GroupBy(dataJSONArr, 'firstname')
    let dump = [
        { table: "Agent", data: Object.keys(extra.GroupBy(dataJSONArr, 'agent')).map(a => { return { _id: uuidv4(), name: a } }) },
        { table: "Account", data: Object.keys(extra.GroupBy(dataJSONArr, 'account_name')).map(a => { return { _id: uuidv4(), name: a } }) },
        { table: "Category", data: Object.keys(extra.GroupBy(dataJSONArr, 'category_name')).map(c => { return { _id: uuidv4(), name: c } }) },
        { table: "Career", data: Object.keys(extra.GroupBy(dataJSONArr, 'company_name')).map(c => { return { _id: uuidv4(), name: c } }) },
        { table: "User", data: Object.keys(gUsers).map(n => { return { _id: uuidv4(), name: n, city:gUsers[n][0].city, phone: gUsers[n][0].phone, address: gUsers[n][0].address, zip: gUsers[n][0].zip, dob: gUsers[n][0].dob, state: gUsers[n][0].state, email: gUsers[n][0].email } })}        
    ]

    let policies = dataJSONArr.map(d => { return {
        _id: d["policy_number"],
        start_date: d["policy_start_date"],
        end_date: d["policy_end_date"],
        agent: dump[0].data.find(a => a.name===d["agent"]),
        account: dump[1].data.find(a => a.name===d["account_name"]),
        category: dump[2].data.find(c => c.name===d["category_name"]),
        company: dump[3].data.find(c => c.name===d["company_name"]),        
        user: dump[4].data.find(u => u.name===d["firstname"])
    } })

    dump.push({ table: "Policy", data: policies })
    
    console.log(dump[0].data.length, " Agents")    
    console.log(dump[1].data.length, " Accounts")    
    console.log(dump[2].data.length, " Categories")    
    console.log(dump[3].data.length, " Careers")    
    console.log(dump[4].data.length, " Users")
    console.log(dump[5].data.length, " Policies") 

    dump.map(d => {        
        pool.create({
            script: LOADER_PATH,
            data: { table: d.table, data: d.data },
            onCreate: () => { console.log("Executing") },
            onError: (err, threadId) => { console.log("Error: ", err, "\tfrom Thread: ", threadId) },
            onExit: (threadId) => { console.log("Exited: ", threadId) },
            onMsg: (msg) => { console.log("Message: ", msg) }
        })
    })

    res.send({statusCode: 1})
})

/*Server*/
app.listen(3001, () => {
    console.log("Listening at 3001")
})

/*Pool Tasks*/