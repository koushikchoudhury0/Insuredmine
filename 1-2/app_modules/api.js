const database = require("./db")

module.exports = {
    getPolicyByUserName: async(names) => {
        try {
            let con = await database.connect()
            let db = con.db("insuredmine")            
            let res =  await db.collection("Policy").find({"user.name": { "$in": names }}).toArray() 
            //console.log("Query Result: ", res)
            return res
        } catch(err) {
            console.log(err)
        }
    }
}