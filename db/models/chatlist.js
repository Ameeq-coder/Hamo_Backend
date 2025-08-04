'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ChatList = sequelize.define('ChatList', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  servicemanId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastMessage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  onlineStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  tableName: 'ChatLists',
  modelName: 'ChatList'
});

ChatList.associate = (models) => {
  ChatList.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
  ChatList.belongsTo(models.ServiceMan, {
    foreignKey: 'servicemanId',
    as: 'serviceman'
  });
  ChatList.hasMany(models.Message, {
    foreignKey: 'chatListId',
    as: 'messages'
  });
};

module.exports = ChatList;