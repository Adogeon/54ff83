const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE_URL ||
    `postgres://${process.env.POSTGRES_USERNAME}:${process.env.POSTGRES_PASSWORD}@localhost:5432/messenger`,
  {
    logging: false,
    dialect: "postgres",
  }
);

module.exports = db;
