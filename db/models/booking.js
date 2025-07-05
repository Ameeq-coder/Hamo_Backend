'use strict';
const {
  Sequelize,
  DataTypes
} = require('sequelize');

const sequelize = require('../../config/database');

module.exports = sequelize.define('Bookings', {
 id: {
  allowNull: false,
  primaryKey: true,
  type: Sequelize.STRING, // ✅ Fix this line
},
  servicemanId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'ServiceMan',
      key: 'id'
    }
  },
  serviceManName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  serviceOptions: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
 status: {
  type: DataTypes.STRING,
  allowNull: false,
},
bookingDateTime: {
  type: DataTypes.DATE,
  allowNull: false
},


  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW')
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW')
  },
  deletedAt: {
    type: DataTypes.DATE
  }
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: 'bookings',
});
