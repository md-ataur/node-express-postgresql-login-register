const { Sequelize } = require("sequelize");
const logger = require("./logger");
require("dotenv").config();

const DB = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "postgres",
  logging: false,
});

/* const sequelize = new Sequelize('postgres', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
}); */

DB.authenticate()
  .then(() => logger.info("Connected to database server"))
  .catch((error) => logger.info(`Unable to connect to database server. Error: ${error}`));

module.exports = DB;
