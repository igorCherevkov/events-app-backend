'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('users', [
      {
        email: 'user1@mail.ru',
        password: 'password1',
        role: 'user',
        confirmation: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'user2@mail.ru',
        password: 'password2',
        role: 'user',
        confirmation: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'admin@mail.ru',
        password: 'passwordadmin',
        role: 'admin',
        confirmation: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
