const Pool = require("pg").Pool;

require("dotenv").config();
const { DB_CONN_LINK } = process.env;

// const pool = new Pool({
//   name: "postgres",
//   port: 5432,
//   host: "localhost",
//   password: "smallville_03",
//   database: "auth_server",
// });

const pool = new Pool({
  connectionString: DB_CONN_LINK,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
