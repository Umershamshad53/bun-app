/* eslint-disable @typescript-eslint/no-require-imports */
import { config } from "dotenv";
import { Sequelize } from "sequelize";

config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    dialect: "mysql",
    dialectModule: require("mysql2"),
    logging: false,
    // optional: timezone or pool config can be added here if needed
  }
);

export default sequelize;
