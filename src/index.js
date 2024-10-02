import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// import express from "express";
// const app =express()

dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is runnuing at port ${process.env.PORT} `)
    })
}
)
.catch((error)=>{
    console.error("mongodb conection failed !!");
    
})