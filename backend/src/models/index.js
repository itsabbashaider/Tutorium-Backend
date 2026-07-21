"use strict";

// ─── Core Dependencies ────────────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');
const process = require('process');

// ─── Sequelize ────────────────────────────────────────────────────────────────
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Import our unified config file
const config = require('../config/config')[env];
const db = {};

// ─── Sequelize Instance ───────────────────────────────────────────────────────
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );

// ─── Verify Database Connection ───────────────────────────────────────────────
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database is connected successfully.");
  }
  catch (error) {
    console.error("Unable to connect database.");
    console.error(error);
    process.exit(1);
  }
};

connectDatabase();

// ─── Load Models ──────────────────────────────────────────────────────────────
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.endsWith(".js") &&
      !file.endsWith(".test.js")
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );

    db[model.name] = model;
  });

// ─── Apply Associations ───────────────────────────────────────────────────────
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ─── Export ───────────────────────────────────────────────────────────────────
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;