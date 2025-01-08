import 'dotenv/config'
import connectDB from "./db/index.js";
// dotenv.config()

connectDB()














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
