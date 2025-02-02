// impo       rt dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
import 'dotenv/config'

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
        
    })    
})
.catch((err)=>{
    console.log("Mongodb Connection Failed",err);
    
})














/*
import express from "express";
const app = express();

(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("Error", error);
            throw err            
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`server connected at port http://localhost:${PORT}`);
            
        })

    } catch (error) {
        console.log("Erorre", error);
        throw err
        
    }

})()
*/
