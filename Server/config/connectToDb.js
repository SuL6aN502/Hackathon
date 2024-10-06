const mongoose = require("mongoose");

async function conectToDb() {
    try{
        await mongoose.connect(process.env.DB);
        console.log("db is Connected");
        
    }catch(err){
        console.log(err + "\ndb is not connected");
    }
}

module.exports = conectToDb;