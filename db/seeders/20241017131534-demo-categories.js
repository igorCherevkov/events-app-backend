'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('categories', [
      {
        name: 'programming',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'web',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('categories', null, {});
  },
};
