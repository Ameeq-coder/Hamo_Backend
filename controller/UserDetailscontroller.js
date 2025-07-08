const db = require("../db/models/index");
const { User, UserDetail } = db;
const { Op } = require('sequelize');
// Alternative: Import models directly
// const User = require("../db/models/user");
// const UserDetail = require("../db/models/userdetails");

const createOrUpdateUserDetails = async (req, res) => {
  const { nanoid } = await import('nanoid');

  try {
    const { userId, name, dob, phone, address } = req.body;
    const imageUrl = req.file?.path; // ✅ Get Cloudinary image URL

    if (!userId || !name) {
      return res.status(400).json({ message: 'userId and name are required.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let userDetails = await UserDetail.findOne({ where: { userId } });

    if (userDetails) {
      userDetails = await userDetails.update({
        name,
        dob,
        phone,
        address,
        imageUrl: imageUrl || userDetails.imageUrl, // ✅ only update if a new image was uploaded
        updatedAt: new Date()
      });

      return res.status(200).json({
        message: 'User details updated successfully.',
        userDetails: {
          id: userDetails.id,
          userId: userDetails.userId,
          name: userDetails.name,
          dob: userDetails.dob,
          phone: userDetails.phone,
          address: userDetails.address,
          imageUrl: userDetails.imageUrl // ✅ return image
        }
      });
    } else {
      const customId = 'dtl_' + nanoid(10);

      userDetails = await UserDetail.create({
        id: customId,
        userId,
        name,
        dob,
        phone,
        address,
        imageUrl, // ✅ add image
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return res.status(201).json({
        message: 'User details created successfully.',
        userDetails: {
          id: userDetails.id,
          userId: userDetails.userId,
          name: userDetails.name,
          dob: userDetails.dob,
          phone: userDetails.phone,
          address: userDetails.address,
          imageUrl: userDetails.imageUrl // ✅ return image
        }
      });
    }
  } catch (error) {
    console.error('User Details Error:', error);
    res.status(500).json({ message: 'Server error while processing user details.' });
  }
};


const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'userId parameter is required.' });
    }
    
    // Debug: Check what models are available
    console.log('Available models in db:', Object.keys(db));
    
    const userDetails = await UserDetail.findOne({ 
      where: { userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'userType']
      }]
    });
    
    if (!userDetails) {
      return res.status(404).json({ message: 'User details not found.' });
    }
    
    res.status(200).json({
      message: 'User details retrieved successfully.',
      userDetails: {
        id: userDetails.id,
        userId: userDetails.userId,
        name: userDetails.name,
        dob: userDetails.dob,
        phone: userDetails.phone,
        address: userDetails.address,
        imageUrl:userDetails.imageUrl,
        user: userDetails.user
      }
    });
  } catch (error) {
    console.error('Get User Details Error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Server error while fetching user details.' });
  }
};


const getUsersByLocation = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: 'Location is required.' });
    }

    // 🔥 Just use raw location directly for filtering
    const users = await UserDetail.findAll({
      where: {
        address: {
          [Op.like]: `%${location}%`
        }
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'userType']
        }
      ]
    });

    if (!users.length) {
      return res.status(404).json({ message: 'No users found for this location.' });
    }

    res.status(200).json({
      message: 'Users fetched successfully.',
      users
    });

  } catch (error) {
    console.error('Error in getUsersByLocation:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




module.exports = {
  createOrUpdateUserDetails,
  getUserDetails,
  getUsersByLocation
};