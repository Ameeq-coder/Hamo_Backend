'use strict';
const {
  Model,
  Sequelize,
  DataTypes
} = require('sequelize');

const sequelize = require('../../config/database');

module.exports = sequelize.define('ServiceMan', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    type: DataTypes.STRING
  },
  serviceType: {
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
  freezeTableName: true,
  modelName: 'serviceman'
});