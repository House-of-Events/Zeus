// import dotenv from 'dotenv';
// dotenv.config();

// export default {
//   development: {
//     client: 'postgresql',
//     connection: {
//       host: process.env.DB_HOST,
//       database: process.env.DB_NAME,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       port: process.env.DB_PORT,
//       ssl: { rejectUnauthorized: false }
//     },
//     migrations: {
//       directory: './db/migrations'
//     }
//   }
// };


import dotenv from 'dotenv';
dotenv.config();
const baseConfig = {
  client: 'postgresql',
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
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
      host: "localhost",
      database: "zeus-docker",
      user: "admin",
      password: "admin",
      port: 5426
    },
  },
  production: {
    client: 'postgresql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: './db/migrations',
    },
  },
  docker: {
    ...baseConfig,
    connection: {
      host: "db",
      database: "zeus-docker",
      user: "admin",
      password: "admin",
      port: 5432,
    },
  },
};

export default knexConfig;