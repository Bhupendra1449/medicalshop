import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import 'dotenv/config'

const connectDB = async () =>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI} / ${DB_NAME}`)    
        console.log(`\nConnection Establish`);
        
    } catch (error) {
        console.log("Mongodb connection Failed", error);
        process.exit(1);
        
    }
}
export default connectDB