'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
     id: {
  allowNull: false,
  primaryKey: true,
  type: Sequelize.STRING, // ✅ Fix this line
},
      servicemanId: {
        type: Sequelize.STRING
      },
      serviceManName: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING
      },
      userName: {
        type: Sequelize.STRING
      },
      serviceType: {
        type: Sequelize.STRING
      },
      serviceOptions: {
        type: Sequelize.JSONB
      },
      location: {
        type: Sequelize.STRING
      },
      paid: {
        type: Sequelize.BOOLEAN
      },
     status: {
       type: Sequelize.STRING,
       allowNull: false,
     },
 bookingDateTime: {
  type: Sequelize.DATE,
  allowNull: false
},
// Inside await queryInterface.createTable('Bookings', { ... })
startTime: {
  type: Sequelize.TIME,
  allowNull: false
},
endTime: {
  type: Sequelize.TIME,
  allowNull: false
},
price: {
  type: Sequelize.FLOAT,
  allowNull: false
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
    await queryInterface.dropTable('Bookings');
  }
};