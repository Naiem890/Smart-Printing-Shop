require("dotenv").config();
const { DB_USERNAME, DB_PASS } = process.env;

const dbConfig = {
  user: DB_USERNAME,
  password: DB_PASS,
//   connectString: "localhost/xe",
};

module.exports = dbConfig;
