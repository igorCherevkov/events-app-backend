'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('events', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      publication: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW,
      },
    });
  },

  down(queryInterface) {
    return queryInterface.dropTable('events');
  },
};
