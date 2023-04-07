const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

const dbConfig = require("./../config/dbConfig");

async function query(sql, params = []) {
	try {
		const connection = await oracledb.getConnection(dbConfig);
		const results = await connection.execute(sql, params);
		console.log("results", results);
		return results.rows ? results.rows : results;
	} catch (err) {
		console.log("Ouch!", err);
	}
}

module.exports = {
	query,
};
