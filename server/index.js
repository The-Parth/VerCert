import express from 'express';
import cors from 'cors';
// import mongoose from 'mongoose';
import connectDB from './src/db.js';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import webauthRoutes from './routes/webauth.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(cookieParser());
const version = process.env.VERSION || 1;

app.get('/', (req, res) => {
  res.send(`Welcome to the Vercet API version ${version}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(fileUpload());

app.use('/auth', authRoutes);
app.use('/webauth', webauthRoutes);

app.listen(3000, () => {
  connectDB();
  console.log('Server is running on port 3000');
});
