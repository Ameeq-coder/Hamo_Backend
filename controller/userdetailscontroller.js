const db = require('../db/models'); // ✅ Correct path to index.js
const UserDetails = db.UserDetails;
const Users = db.Users;

// Create user details
const createUserDetails = async (req, res) => {
  try {
    const { userId, fullName, dob, phoneNumber, address, image } = req.body;

    // Check if user exists first - Fixed for VARCHAR ID
    const user = await Users.findOne({ where: { id: String(userId).trim() } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if details already exist to avoid duplicates (optional)
    const existingDetails = await UserDetails.findOne({ where: { userId } });
    if (existingDetails) {
      return res.status(400).json({ message: 'User details already exist.' });
    }

    const newDetails = await UserDetails.create({
      userId,
      fullName,
      dob,
      phoneNumber,
      address,
      image
    });

    res.status(201).json({ message: 'User details created successfully.', data: newDetails });
  } catch (error) {
    console.error('Error creating user details:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get user details by userId (including user info)
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Add validation for userId parameter
    if (!userId || userId.trim() === '') {
      return res.status(400).json({ 
        message: 'User ID is required.',
        error: 'Missing or empty userId parameter'
      });
    }

    // Trim and convert to string for consistency (matching your create function)
    const cleanUserId = String(userId).trim();

    const userDetails = await UserDetails.findOne({
      where: { userId: cleanUserId },
      include: [
        {
          model: Users,
          as: 'user',
          attributes: ['id', 'email', 'userType'] // select what you want to show
        }
      ]
    });

    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found.' });
    }

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error);
    console.error('Request params:', req.params); // Debug log
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  createUserDetails,
  getUserDetails
};