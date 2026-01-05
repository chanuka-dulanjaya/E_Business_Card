import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Sign up (for creating first admin)
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = new User({ email, password });
    await user.save();

    // Create employee record
    const employee = new Employee({
      userId: user._id,
      email,
      fullName,
      role
    });
    await employee.save();

    // Generate token
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email
      },
      employee: {
        id: employee._id.toString(),
        email: employee.email,
        fullName: employee.fullName,
        role: employee.role,
        mobileNumber: employee.mobileNumber,
        profilePicture: employee.profilePicture,
        department: employee.department,
        position: employee.position
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Find employee record
    const employee = await Employee.findOne({ userId: user._id });
    if (!employee) {
      return res.status(404).json({ error: 'Employee record not found' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email
      },
      employee: {
        id: employee._id.toString(),
        email: employee.email,
        fullName: employee.fullName,
        role: employee.role,
        mobileNumber: employee.mobileNumber,
        profilePicture: employee.profilePicture,
        department: employee.department,
        position: employee.position
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    const employee = await Employee.findOne({ userId: req.userId });

    if (!user || !employee) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id.toString(),
        email: user.email
      },
      employee: {
        id: employee._id.toString(),
        email: employee.email,
        fullName: employee.fullName,
        role: employee.role,
        mobileNumber: employee.mobileNumber,
        profilePicture: employee.profilePicture,
        department: employee.department,
        position: employee.position
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
