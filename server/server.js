import express from "express";
import 'dotenv/config';
import cors from 'cors'
import connectDB from "./configs/mogodb.js";
import { clerkWebHooks, stripeWebhooks } from "./controller/webhooks.js";
import educatorRouter from "./routers/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routers/courseRoutes.js";
import userRouter from './routers/userRouter.js'

const app = express();
await connectDB();
await connectCloudinary();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(clerkMiddleware());
app.use(express.json());

app.get('/',(req,res)=> {res.send("HELLLO")})
app.post('/clerk', clerkWebHooks);
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter);
app.post('/stripe', express.raw({type:'application/json'}),stripeWebhooks)

app.listen(PORT, ()=>{
    console.log(`App started at Port: http://localhost:${PORT}`);
})