// const { ChatList, Message, User, ServiceMan } = require('../models');
const User= require("../db/models/user");
const ChatList= require("../db/models/chatlist")
const ServiceMan = require("../db/models/serviceman")
const Message = require("../db/models/message")
const UserDetail=require("../db/models/userdetails")
const ServiceDetail=require("../db/models/servicedetail")
const { v4: uuidv4 } = require('uuid');

const getOrCreateChat = async (req, res) => {
  try {
    const { userId, servicemanId } = req.body;

    let chat = await ChatList.findOne({
      where: { userId, servicemanId },
      include: [
        { model: User, as: 'user' },
        { model: ServiceMan, as: 'serviceman' }
      ]
    });

    if (!chat) {
      chat = await ChatList.create({
        id: uuidv4(),
        userId,
        servicemanId,
        lastMessage: '',
        onlineStatus: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Fetch with included models after creation
      chat = await ChatList.findOne({
        where: { id: chat.id },
        include: [
          { model: User, as: 'user' },
          { model: ServiceMan, as: 'serviceman' }
        ]
      });
    }

    res.json(chat);
  } catch (error) {
    console.error("🔥 Chat Creation Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllChatsForUser = async (req, res) => {
  const { userId } = req.params;
  const chats = await ChatList.findAll({
    where: { userId },
    include: [
      {
        model: User,
        as: 'user',
          include: [{ model: UserDetail, as: 'details' }] // ✅ fixed alias
      },
      {
        model: ServiceMan,
        as: 'serviceman',
        include: [{ model: ServiceDetail, as: 'detail' }]
      }
    ],
    order: [['updatedAt', 'DESC']]
  });

  res.json(chats);
};


const getAllChatsForServiceman = async (req, res) => {
  const { servicemanId } = req.params;
  const chats = await ChatList.findAll({
    where: { servicemanId },
    include: [
      {
        model: User,
        as: 'user',
        include: [{ model: UserDetail, as: 'details' }]
      },
      {
        model: ServiceMan,
        as: 'serviceman',
        include: [{ model: ServiceDetail, as: 'detail' }]
      }
    ],
    order: [['updatedAt', 'DESC']]
  });

  res.json(chats);
};


const getMessages = async (req, res) => {
  const { chatListId } = req.params;

  const messages = await Message.findAll({
    where: { chatListId },
    order: [['createdAt', 'ASC']]
  });

  res.json(messages);
};

module.exports = {
  getOrCreateChat,
  getAllChatsForUser,
  getAllChatsForServiceman,
  getMessages
};
