const express = require('express');
const router = express.Router();
const chatController = require('../controller/chatcontroller');

router.post('/create', chatController.getOrCreateChat);
router.get('/user-chats/:userId', chatController.getAllChatsForUser);
router.get('/serviceman-chats/:servicemanId', chatController.getAllChatsForServiceman);
router.get('/messages/:chatListId', chatController.getMessages);

module.exports = router;
