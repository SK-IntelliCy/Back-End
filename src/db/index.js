import mongoose from "mongoose";




const connectDB =async ()=>{
    try{
        const ConectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n conected , DB Host -:${ConectionInstance.connection.host}`)
    }catch (error){
        console.log(error,'error')
        process.exit(1)
    }
}

export default connectDB;


// import { DB_Name } from "../constants.js";