const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const Message = require("./db/models/message");
const ChatList = require("./db/models/chatlist");

const initWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  // Map: socket -> joined chatListId
  const socketRooms = new Map();

  wss.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', async (data) => {
      try {
        const parsed = JSON.parse(data);

        // Step 1: Handle joining a room
        if (parsed.type === 'join') {
          socketRooms.set(socket, parsed.chatListId);
          console.log(`Socket joined chatListId: ${parsed.chatListId}`);
          return;
        }

        // Step 2: Handle sending a message
        if (parsed.type === 'send_message') {
          const { chatListId, senderId, senderType,recevierid,receviertype, message } = parsed;

          const newMsg = await Message.create({
            id: uuidv4(),
            chatListId,
            senderId,
            senderType,
          recevierid,
          receviertype,
            message
          });

          await ChatList.update(
            { lastMessage: message },
            { where: { id: chatListId } }
          );

          // Step 3: Broadcast only to the same room
          wss.clients.forEach(client => {
            if (
              client.readyState === WebSocket.OPEN &&
              socketRooms.get(client) === chatListId
            ) {
              client.send(JSON.stringify({
                type: 'new_message',
                message: newMsg
              }));
            }
          });
        }
      } catch (err) {
        console.error('WebSocket Error:', err);
      }
    });

    socket.on('close', () => {
      console.log('Client disconnected');
      socketRooms.delete(socket);
    });
  });
};

module.exports = initWebSocket;
