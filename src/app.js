import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"2mb"}))
app.use(express.urlencoded({extended:true , limit:"2mb"}))
app.use(express.static("public"))
app.use(cookieParser())
// app.use(express.cookieParser(config.cookieSecret))

// routes 
import userRouter from "./routes/user.routers.js "

app.use("/api/v1/users", userRouter)

export { app }