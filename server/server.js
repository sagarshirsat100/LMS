import express from "express";
import 'dotenv/config';
import cors from 'cors'
import connectDB from "./configs/mogodb.js";
import { clerkWebHooks } from "./controller/webhooks.js";


const app = express();
await connectDB();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=> {
    res.send("HELLLO");
})
app.post('/clerk', clerkWebHooks);

app.listen(PORT, ()=>{
    console.log(`App started at Port: http://localhost:${PORT}`);
})