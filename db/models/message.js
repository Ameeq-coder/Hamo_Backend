'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Message = sequelize.define('Message', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  chatListId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senderType: {
    type: DataTypes.STRING,
    allowNull: false
    // values: 'user', 'serviceman'
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  paranoid: false,
  freezeTableName: true,
  tableName: 'Messages',
  modelName: 'Message'
});

Message.associate = (models) => {
  Message.belongsTo(models.ChatList, {
    foreignKey: 'chatListId',
    as: 'chatList'
  });
  // Polymorphic association - sender can be either User or ServiceMan
  Message.belongsTo(models.User, {
    foreignKey: 'senderId',
    as: 'userSender',
    constraints: false,
    scope: {
      senderType: 'user'
    }
  });
  Message.belongsTo(models.ServiceMan, {
    foreignKey: 'senderId',
    as: 'servicemanSender',
    constraints: false,
    scope: {
      senderType: 'serviceman'
    }
  });
};

module.exports = Message;