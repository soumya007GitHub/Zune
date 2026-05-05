import express from "express";
import 'dotenv/config';
import mongoose from "mongoose";
import http from 'node:http';
import cors from "cors";
import {socketConnection} from "./controllers/socketConnection.js";
import router from "./routes/userRoutes.js";

const app = express();
const server = http.createServer(app);
const io = socketConnection(server);
const port = process.env.PORT;
const mongo_url = process.env.MONGO_URL;

app.use(express.json({"limit":"40kb"}));
app.use(express.urlencoded({extended:true, limit:"40kb"}));
app.use(cors());

app.use("/", router);

app.listen(port, async ()=>{
    try{
        await mongoose.connect(mongo_url);
        console.log("Connected to MongoDB!");
    }
    catch(err){
        console.log("Failed to connect to MongoDB");
        console.error(err);
    }
    console.log(`Server started on port: ${port}`);
})