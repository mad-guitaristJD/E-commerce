const mongoose = require("mongoose");

const connectDB = async()=>{
    try{

        await mongoose.connect(process.env.DATABASE_URI);
        console.log("Datbase connected")
    }
    catch(error){
        console.log("Database could not be connected",error)
        process.exit(1);
    }
}

module.exports = connectDB;