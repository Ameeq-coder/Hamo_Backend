const ServiceMan = require('../db/models/serviceman');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signupServiceMan = async (req, res) => {
  const { nanoid } = await import('nanoid');
  const customId = 'srv_' + nanoid(10);

  try {
    const { email, password, serviceType } = req.body;

    const existing = await ServiceMan.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'ServiceMan already exists with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newServiceMan = await ServiceMan.create({
      id: customId,
      email,
      password: hashedPassword,
      serviceType,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'ServiceMan registered successfully.',
      serviceman: {
        id: newServiceMan.id,
        email: newServiceMan.email,
        serviceType: newServiceMan.serviceType
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during serviceman signup.' });
  }
};


const loginServiceMan = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 2. Find serviceman by email
    const serviceman = await ServiceMan.findOne({ where: { email } });
    if (!serviceman) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, serviceman.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      {
        id: serviceman.id,
        email: serviceman.email,
        serviceType: serviceman.serviceType
      },
      process.env.JWT_SECRET || 'your-secret-key', // make sure to store in .env
      { expiresIn: '1h' }
    );

    // 5. Send response
    res.status(200).json({
      message: 'Login successful.',
      token,
      serviceman: {
        id: serviceman.id,
        email: serviceman.email,
        serviceType: serviceman.serviceType
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during serviceman login.' });
  }
};


module.exports = { signupServiceMan, loginServiceMan };
