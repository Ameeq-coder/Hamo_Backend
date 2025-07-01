'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ServiceDetails', {
     id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      servicemanId: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      serviceHead: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.FLOAT
      },
      about: {
        type: Sequelize.TEXT
      },
      imageUrl: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
  type: Sequelize.DATE
}

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ServiceDetails');
  }
};