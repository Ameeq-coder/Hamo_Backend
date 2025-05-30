const { Sequelize } = require('sequelize');
const pg = require('pg');

// Only load dotenv in development
if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

console.log('🔍 Vercel Environment Debug:');
console.log('VERCEL:', process.env.VERCEL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('All env vars starting with DATABASE_:', 
  Object.keys(process.env).filter(k => k.includes('DATABASE')));

let sequelize;

// Get database configuration
function getDatabaseConfig() {
  // For Vercel deployment
  if (process.env.VERCEL) {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      console.error('❌ DATABASE_URL not found in Vercel environment');
      console.log('Available env vars:', Object.keys(process.env).sort());
      throw new Error('DATABASE_URL environment variable is required for Vercel deployment');
    }
    
    console.log('✅ Found DATABASE_URL in Vercel environment');
    return {
      url: dbUrl,
      config: {
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
        logging: false,
      }
    };
  }
  
  // For local development
  const config = require('./config');
  const env = process.env.NODE_ENV || 'development';
  
  return {
    config: {
      ...config[env],
      dialectModule: pg,
      logging: console.log,
    }
  };
}

// Initialize Sequelize
try {
  const dbConfig = getDatabaseConfig();
  
  if (dbConfig.url) {
    console.log('🚀 Connecting with DATABASE_URL');
    sequelize = new Sequelize(dbConfig.url, dbConfig.config);
  } else {
    console.log('🏠 Connecting with config object');
    sequelize = new Sequelize(dbConfig.config);
  }
} catch (error) {
  console.error('❌ Failed to initialize Sequelize:', error.message);
  throw error;
}

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // More detailed error logging for debugging
    if (process.env.VERCEL) {
      console.error('Vercel deployment error details:', {
        errorName: error.name,
        errorMessage: error.message,
        hasParent: !!error.parent,
        parentMessage: error.parent?.message,
      });
    }
    
    throw error;
  }
};

testConnection();

module.exports = sequelize;