'use strict';
const {
  Model,
  Sequelize,
  DataTypes
} = require('sequelize');

const sequelize = require('../../config/database');

module.exports = sequelize.define('ServiceDetails', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  servicemanId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'ServiceMan', // match table name if necessary
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING
  },
  serviceHead: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.FLOAT
  },
  about: {
    type: DataTypes.TEXT
  },
  imageUrl: {
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
  modelName: 'servicedetails',
});
