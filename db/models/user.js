'use strict';
const {
  Model,
  Sequelize,
  DataTypes
} = require('sequelize');

const sequelize=require('../../config/database')


module.exports = sequelize.define('Users',{
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
      deletedAt : {
        type:DataTypes.DATE,
      }
    },{
      paranoid :true,
      freezeTableName:true,
      modelName:'user'
    }
  );
  