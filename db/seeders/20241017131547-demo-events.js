'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('events', [
      {
        name: 'programming event',
        description: 'this event is dedicated to programming',
        publication: true,
        date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'web event',
        description: 'this event is dedicated to web',
        publication: true,
        date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('events', null, {});
  },
};
