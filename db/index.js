import knex from "knex";
import knexConfig from "../knexfile.js";
import dotenv from "dotenv";
dotenv.config();
const environment = process.env.NODE_ENV || "development";
let config = knexConfig[environment];


config = {
  ...config,
  cliet: "pg",
};

const db = knex(config);

export { db };
