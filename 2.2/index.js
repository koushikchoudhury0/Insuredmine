const express = require("express")
const DatabaseManager = require("./app_modules/db")

var app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post("/msg", (req, res) => {
    try {
        DatabaseManager.addMsg(req.body.msg)
        res.send({statusCode: 1})
    } catch(err) {
        console.log(err)
        res.send({statusCode: 0})
    }
})

app.listen("3003", () => { console.log("Listening on Port: 3003") })
