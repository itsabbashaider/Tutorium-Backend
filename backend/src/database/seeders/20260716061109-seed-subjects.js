'use strict';

const { v7: uuidv7 } = require("uuid");
const SUBJECTS = require("../../constants/subjects.constant")


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const subjects = SUBJECTS.map((subject) => {
      return {
        subject_id: uuidv7(),
        created_at: new Date(),
        updated_at: new Date(),
        ...subject,
      }
    });

    await queryInterface.bulkInsert(
      "subjects",
      subjects
    );
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete(
      "subjects",
      null,
      {}
    );

  }
};
