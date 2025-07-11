import express, { response } from "express";
import cors from "cors";
import 'dotenv/config';
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import ShowRouter from './routes/ShowRoutes.js';
import bookingRouter from "./routes/bookingroutes.js";
import adminRouter from "./routes/adminroutes.js";
import userRouter from "./routes/userRoutes.js";

const app=express();
const port =3000;

await connectDB()

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())
app.use('/api/show',ShowRouter)
app.use('/api/booking',bookingRouter)
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)


app.get("/", (req,res)=> res.send("server is live"))
app.use('/api/inngest', serve({ client: inngest, functions }))

app.listen(port, () => console.log(`server listening at http://localhost:${port}`));
