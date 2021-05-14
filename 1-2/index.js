const express = require("express")
const api = require("./app_modules/api")
require("./app_modules/monitor")

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post("/search", async(req, res) => {    
    let data = await api.getPolicyByUserName(req.body.names)     
    if (data.length===0) res.send({ statusCode: 0, msg: "No Such Users found" })    
    res.send({statusCode: 1, data: data})
})

app.post("/stress", (req, res) => { res.send({result: fibo(40)}) })

app.listen(3002, () => { console.log("Listening at 3002") })

const fibo = (n) => { return n < 2?1:(fibo(n - 2) + fibo(n - 1)) }