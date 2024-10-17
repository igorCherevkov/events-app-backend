'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('events_categories', [
      {
        event_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        event_id: 2,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('events_categories', null, {});
  },
};
