'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserDetails = sequelize.define('UserDetails', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING
    },
    dob: {
      type: DataTypes.DATEONLY
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING
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
    freezeTableName: true,
    modelName: 'UserDetails'
  });

  UserDetails.associate = function(models) {
    UserDetails.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return UserDetails;
};