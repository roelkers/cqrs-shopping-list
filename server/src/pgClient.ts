import keys from "./keys";

// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = process.env.DATABASE_URL ?
  new Pool({
    connectionString: process.env.DATABASE_URL
  }) :
  new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
  });

export default pgClient;
