require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require('express');
const app = express();
const sequelize = require('./config/database'); // ✅ import database connection
const http = require('http'); 
const initWebSocket = require('./websocket'); // Adjust path if your file is elsewhere



app.use(express.json());

const authRouter = require('./route/authroute');
const serviceauthrouter= require('./route/servicemanroute')
const userdetailrouter=require('./route/userdetailroute')
const serviceDetailRoute = require('./route/servicedetailroute');
const bookingRoutes = require('./route/bookingRoutes');
const inviteRoutes = require('./route/inviterouter');
const chatRoutes=require('./route/chatRoutes')


app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Server Working Successfuly',
    message: 'Welcome To Hamo Backend'
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/serviceauth',serviceauthrouter)
app.use('/api/v1/userdetail',userdetailrouter)
app.use('/api/v1/servicedetail', serviceDetailRoute);
app.use('/api/v1/booking',bookingRoutes);
app.use('/api/v1/invites',inviteRoutes)
app.use('/api/v1/chat', chatRoutes);

const PORT=process.env.APP_PORT||5001

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully!');

    // Combine Express and WebSocket
    const server = http.createServer(app);     // Create HTTP server using Express app
    initWebSocket(server);                     // Pass it to WebSocket initializer

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Unable to connect to the database:', error);
  });

module.exports = app;
