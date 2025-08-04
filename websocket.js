const WebSocket = require('ws');
const path = require('path');
const Message = require("./db/models/message");  // Removed Hamo_Backend from path
const ChatList = require("./db/models/chatlist"); 
const { v4: uuidv4 } = require('uuid');

const initWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', async (data) => {
      try {
        const { chatListId, senderId, senderType, message } = JSON.parse(data);

        const newMsg = await Message.create({
          id: uuidv4(), 
          chatListId,
          senderId,
          senderType,
          message
        });

        await ChatList.update(
          { lastMessage: message },
          { where: { id: chatListId } }
        );

        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'new_message',
              message: newMsg
            }));
          }
        });
      } catch (err) {
        console.error('WebSocket Error:', err);
      }
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = initWebSocket;
