const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mockDb = require('../mockDb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Check if MongoDB is connected
const mongoose = require('mongoose');
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Register
router.post('/register', async (req, res) => {
  const { username, password, license } = req.body;
  try {
    if (isMongoConnected()) {
      // Use MongoDB
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword, license });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } else {
      // Use mock database
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = { username, password: hashedPassword, license };
      await mockDb.save(userData);
      res.status(201).json({ message: 'User registered successfully' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password, license } = req.body;
  try {
    let user;
    if (isMongoConnected()) {
      // Use MongoDB
      user = await User.findOne({ username });
    } else {
      // Use mock database
      user = await mockDb.findOne({ username });
    }
    
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    // Check license if provided
    if (license && user.license !== license) {
      return res.status(400).json({ message: 'Invalid license number' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, license: user.license },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: { id: user._id, username: user.username, license: user.license }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route - get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
