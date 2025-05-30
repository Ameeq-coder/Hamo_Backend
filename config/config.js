require('dotenv').config({ path: `${process.cwd()}/.env` });

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '12345678',
    database: process.env.DB_NAME || 'HAMO_DB',
    port: process.env.DB_PORT || 5432,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '12345678',
    database: process.env.DB_NAME || 'HAMO_DB',
    port: process.env.DB_PORT || 5432,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'postgresql://postgres.jztymqihjrgbvbnyzqmd:Ameeq25012003$@aws-0-us-east-2.pooler.supabase.com:5432/postgres',
    dialect: 'postgres',
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
    logging: false, // Disable logging in production
  },
};