'use strict';
const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'user',
      [
        {
            username: 'ari',
            password: await bcrypt.hash('ariyogi', 10), //setup with bcrypt encrypt
            nama_lengkap: 'ari yogi',
            alamat: 'Jl. Kemana mana',
            email: 'supranatural345@gmail.com',
            nomor_telepon: '08333333334',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {});
  }
};
