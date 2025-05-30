'use strict';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
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
    freezeTableName: true,
    modelName: 'Users'
  });

  Users.associate = function(models) {
    Users.hasOne(models.UserDetails, {
      foreignKey: 'userId',
      as: 'details',
      onDelete: 'CASCADE'
    });
  };

  return Users;
};