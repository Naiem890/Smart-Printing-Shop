require("dotenv").config();
const { DB_USERNAME, DB_PASS, DB_CONNECT_STRING } = process.env;

const dbConfig = {
  user: DB_USERNAME,
  password: DB_PASS,
  // Where the Oracle database lives. Falls back to local XE when not set.
  connectString: DB_CONNECT_STRING || "localhost/xe",
};

module.exports = dbConfig;
