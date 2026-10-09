'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'security_question_1', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Security question 1 text',
    });

    await queryInterface.addColumn('users', 'security_answer_hash_1', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Hashed answer to security question 1',
    });

    await queryInterface.addColumn('users', 'security_question_2', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Security question 2 text',
    });

    await queryInterface.addColumn('users', 'security_answer_hash_2', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Hashed answer to security question 2',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'security_question_1');
    await queryInterface.removeColumn('users', 'security_answer_hash_1');
    await queryInterface.removeColumn('users', 'security_question_2');
    await queryInterface.removeColumn('users', 'security_answer_hash_2');
  }
};