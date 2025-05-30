const { Sequelize } = require('sequelize');
require('dotenv').config({ path: `${process.cwd()}/.env` });
const pg = require('pg');

const env = process.env.NODE_ENV || 'development';
const config = require('./config');

console.log('🔍 Environment Check:');
console.log('NODE_ENV:', env);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('VERCEL:', process.env.VERCEL);

let sequelize;

// Force production environment on Vercel
const isProduction = env === 'production' || process.env.VERCEL || process.env.DATABASE_URL;

if (isProduction && process.env.DATABASE_URL) {
  console.log('🚀 Using Production Database (Supabase)');
  console.log('Database URL (first 30 chars):', process.env.DATABASE_URL.substring(0, 30) + '...');
  
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false, // Set to console.log for debugging
  });
} else {
  console.log('🏠 Using Local Database');
  sequelize = new Sequelize(config[env], {
    dialectModule: pg,
    logging: console.log,
  });
}

// Test connection function
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Log connection details (without sensitive info)
    console.log('📊 Connection info:', {
      dialect: sequelize.getDialect(),
      host: sequelize.config.host || 'from URL',
      port: sequelize.config.port || 'from URL',
      database: sequelize.config.database || 'from URL'
    });
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error type:', error.constructor.name);
    
    if (error.parent) {
      console.error('Connection details:', {
        address: error.parent.address,
        port: error.parent.port,
        code: error.parent.code
      });
    }
    
    return false;
  }
};

// Test connection on startup
testConnection();

module.exports = sequelize;