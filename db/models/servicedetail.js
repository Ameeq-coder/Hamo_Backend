'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ServiceDetail = sequelize.define('ServiceDetail', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  servicemanId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'ServiceMan',
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
  tableName: 'ServiceDetails',
  modelName: 'ServiceDetail'
});

// Define association
ServiceDetail.associate = (models) => {
  ServiceDetail.belongsTo(models.ServiceMan, {
    foreignKey: 'servicemanId',
    as: 'serviceman'
  });
};

module.exports = ServiceDetail;
