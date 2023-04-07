const { query } = require("../../services/dbService");

exports.getTeachers = async (req, res, next) => {
	const result = await query("Select * from cse_teachers");
	res.send(result);
};

exports.addTeacher = async (req, res, next) => {
	const result = await query("INSERT INTO CSE_TEACHERS (NAME, DESIGNATION, MAIL, SALARY) VALUES ('Solaiman','Lec','solaiman@yahoo.com',100000)");
	res.send(result);
};
