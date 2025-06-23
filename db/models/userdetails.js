'use strict';
const {
  DataTypes
} = require('sequelize');

const sequelize = require('../../config/database');

const UserDetail = sequelize.define('UserDetail', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
  type: DataTypes.STRING,
  allowNull: true
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
    type: DataTypes.DATE,
  }
}, {
  paranoid: true,
  tableName: 'UserDetails',
  modelName: 'UserDetail'
});

UserDetail.associate = (models) => {
  UserDetail.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = UserDetail;
