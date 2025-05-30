const { Sequelize } = require('sequelize');
require('dotenv').config({ path: `${process.cwd()}/.env` });
const pg = require('pg'); // Explicitly require pg

const env = process.env.NODE_ENV || 'development';
const config = require('./config');

let sequelize;

if (process.env.DATABASE_URL) {
  // For Vercel or Neon
  console.log(process.env.DATABASE_URL);
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectModule: pg, // Add this line to explicitly use pg
    dialectOptions: {
      ssl: {
        require: true, 
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // Local connection
  sequelize = new Sequelize(config[env], {
    dialectModule: pg // Add this line here too
  });
}

module.exports = sequelize;