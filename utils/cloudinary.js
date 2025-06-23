const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: `${process.cwd()}/.env` });


cloudinary.config({
  cloud_name: process.env.cloud_name,     // 🔁 Replace with your actual Cloudinary credentials
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

module.exports = cloudinary;
