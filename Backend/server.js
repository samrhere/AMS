import express from 'express'
import connectDB from './config/db.js'
import dotenv from 'dotenv'
import cors from 'cors'
import {v2 as cloudinary} from 'cloudinary'
import cookieParser from 'cookie-parser'

import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import attendanceRouter from './routes/attendance.route.js'
import leaveRouter from './routes/leave.route.js'
import gradeRouter from './routes/grade.route.js'

dotenv.config();
connectDB();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
}));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter)
app.use('/api/attendance', attendanceRouter)
app.use('/api/leave', leaveRouter)
app.use('/api/grade', gradeRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
