import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan'; 
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { connectDB } from './config/connectDB.js';
import { todosLimiter } from './middleware/LimiteMiddleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev')); 

app.use('/api/auth', authRoutes);
app.use('/api/todos', todosLimiter,todoRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB()



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
