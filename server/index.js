import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './src/db.js';

import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import webauthRoutes from './routes/webauth.js';
import blockRoutes from './routes/blockRoutes.js';

dotenv.config();
const hosted = process.env.HOSTED || false;

const app = express();
app.use(
  cors({
    origin: hosted ? process.env.HOST_URL : 'http://localhost:5000',
    credentials: true,
  })
);
app.use(cookieParser());
const version = process.env.VERSION || 1;

const prepend = hosted ? '/api' : '';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(fileUpload());
app.set('trust proxy', 1);

app.get(`${prepend}/`, (req, res) => {
  res.send(`Welcome to the Vercet API version ${version}`);
});

app.use(`${prepend}/auth`, authRoutes);
app.use(`${prepend}/webauth`, webauthRoutes);
app.use(`${prepend}/upload`, uploadRoutes);
app.use(`${prepend}/block`, blockRoutes);

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(' MongoDB Connection Error:', err));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
