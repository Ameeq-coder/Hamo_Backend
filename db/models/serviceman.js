'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ServiceMan = sequelize.define('ServiceMan', {
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
  tableName: 'ServiceMan',
  modelName: 'ServiceMan'
});

// Define association
ServiceMan.associate = (models) => {
  ServiceMan.hasOne(models.ServiceDetail, {
    foreignKey: 'servicemanId',
    as: 'detail'
  });


    ServiceMan.hasMany(models.Bookings, {
    foreignKey: 'servicemanId',
    as: 'bookings'
  });

ServiceMan.hasMany(models.Invite, {
  foreignKey: 'servicemanId',
  as: 'invites'
});


};

module.exports = ServiceMan;
