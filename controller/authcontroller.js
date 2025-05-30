const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const db = require('../db/models');
const Users = db.Users;
require('dotenv').config({path: `${process.cwd()}/.env`}); 



const signup = async (req, res) => {

  const { nanoid } = await import('nanoid');

    const customId = 'usr_' + nanoid(10); // like usr_H1n93kAaJp

  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await Users.create({
      id: customId, // include this!
      email,
      password: hashedPassword,
      userType: 'user', // optional, since it defaults
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Respond with limited user info
    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser.id,
        email: newUser.email,
        userType: newUser.userType
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup.' });


      if (error.name === 'SequelizeConnectionRefusedError' || 
        error.name === 'SequelizeConnectionError') {
      console.error('❌ Database connection failed during signup');
      return res.status(500).json({
        success: false,
        message: 'Database connection error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        userType: user.userType // 👈 changed from role to userType
      },
      process.env.JWT_SECRET || 'your-secret-key', // make sure to store in .env
      { expiresIn: '1h' }
    );

    // 4. Send response
    res.status(200).json({
      message: 'Login successful.',
      token,
  
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};



module.exports = { signup, login };
