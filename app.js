require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');
const app = express();
const sequelize = require('./config/database'); // ✅ import database connection

app.use(express.json());

const authRouter = require('./route/authroute');
const userDetailsRoute=require('./route/userdetailsroute')

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Server Working Successfuly',
    message: 'Welcome To Hamo Backend'
  });
});

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/userdetails',userDetailsRoute);

const PORT=process.env.APP_PORT||5001

// ✅ First connect to the database, then start server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully!');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Unable to connect to the database:', error);
  });

module.exports = app;
