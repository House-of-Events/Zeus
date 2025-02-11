// import dotenv from "dotenv";
// dotenv.config();
const baseConfig = {
  client: "postgresql",
  migrations: {
    directory: "./db/migrations",
    tableName: "knex_migrations_zeus"
  },
  seeds: {
    directory: "./db/seeds",
  },
  pool: {
    min: 2,
    max: 10,
  },
};

const knexConfig = {
  development: {
    ...baseConfig,
    connection: {
      host: "db",
      database: "mike-docker",
      user: "admin",
      password: "admin",
      port: 5432,
    },
  },
  production: {
    client: "postgresql",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: "./db/migrations",
    },
  },
};

export default knexConfig;
