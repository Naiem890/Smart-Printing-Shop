const oracledb = require("oracledb");
const dbConfig = require("../config/dbConfig");

// Set global options for oracledb module
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;
oracledb.fetchAsBuffer = [oracledb.BLOB];

async function query(sql, params = [], opt = {}) {
  let connection;
  try {
    // Acquire a connection from the connection pool
    connection = await oracledb.getConnection(dbConfig);

    // Execute the SQL statement with the specified parameters
    const result = await connection.execute(sql, params, opt);

    // Return the result rows
    return result;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  } finally {
    // Release the connection back to the pool
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
        throw err;
      }
    }
  }
}

module.exports = { query };
