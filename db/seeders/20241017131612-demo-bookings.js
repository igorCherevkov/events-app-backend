'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('bookings', [
      {
        user_id: 1,
        event_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        event_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('bookings', null, {});
  },
};
