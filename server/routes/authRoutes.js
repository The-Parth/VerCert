import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv, { parse } from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const router = express.Router();
const salt = parseInt(process.env.SALT_ROUNDS) || 10;

const authenticateUser = (req, res, next) => {
  const token =
    req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
};

const EPOCH = 1420070400000n;

function generateSnowflake(email, timestamp = Date.now()) {
  const msSinceEpoch = BigInt(timestamp) - EPOCH;
  const timePart = msSinceEpoch << 22n; // 42 bits

  // Hash the email to simulate Worker ID and Process ID (10 bits total)
  const hash = crypto.createHash('sha256').update(email).digest();
  const workerId = BigInt(hash[0] & 0b00011111); // 5 bits
  const processId = BigInt(hash[1] & 0b00011111); // 5 bits

  const workerProcessPart = (workerId << 17n) | (processId << 12n);

  // Sequence number (12 bits, ideally per-ms sequence; use random here)
  const sequence = BigInt(Math.floor(Math.random() * 4096)) & 0xfffn;

  const snowflake = timePart | workerProcessPart | sequence;
  return snowflake.toString();
}

//  Test API Route
router.get('/', (req, res) => {
  res.json({ msg: 'Auth route' });
});

//  Register User
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);
    const snowflakeId = generateSnowflake(email);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      snowflakeId,
      role,
    });

    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: err.message });
  }
});

//  Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Ensure JWT secret is available
    if (!process.env.JWT_SECRET) {
      throw new Error('Missing JWT_SECRET in .env file');
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Logout User
router.get('/logout', (req, res) => {
  res.cookie('token', '', { expires: new Date(0), httpOnly: true });
  res.status(200).json({ msg: 'Logged out successfully' });
});

//  Get Authenticated User Details (Protected Route)
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
