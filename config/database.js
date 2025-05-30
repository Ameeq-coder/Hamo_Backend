const { Sequelize } = require('sequelize');
require('dotenv').config({ path: `${process.cwd()}/.env` });
const pg = require('pg');

const env = process.env.NODE_ENV || 'development';
const config = require('./config');

let sequelize;

if (process.env.DATABASE_URL) {
  // For Vercel or Neon
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true, 
        rejectUnauthorized: false,
      },
      // Add connection timeout settings
      connectTimeout: 60000, // 60 seconds
      socketTimeout: 60000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 0,
    },
    pool: {
      max: 5,          // Maximum number of connections
      min: 0,          // Minimum number of connections
      acquire: 60000,  // Maximum time to acquire connection (60s)
      idle: 10000,     // Maximum time connection can be idle (10s)
      evict: 1000,     // Time interval to run eviction (1s)
    },
    // Add query timeout
    define: {
      timestamps: false,
    },
    logging: console.log, // Enable logging to debug
  });
} else {
  // Local connection
  sequelize = new Sequelize(config[env], {
    dialectModule: pg,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

module.exports = sequelize;