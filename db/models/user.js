'use strict';
const {
  DataTypes
} = require('sequelize');

const sequelize = require('../../config/database');

const User = sequelize.define('User', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  userType: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  },
  email: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE
  }
}, {
  paranoid: true,
  tableName: 'Users',
  modelName: 'User'
});

User.associate = (models) => {
  User.hasOne(models.UserDetail, {
    foreignKey: 'userId',
    as: 'details'
  });
};

module.exports = User;