'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Invite = sequelize.define('Invite', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  servicemanId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending' // values: pending, accepted, rejected
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
  tableName: 'Invites',
  modelName: 'Invite'
});

Invite.associate = (models) => {
  Invite.belongsTo(models.ServiceMan, {
    foreignKey: 'servicemanId',
    as: 'serviceman'
  });

  Invite.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Invite;
