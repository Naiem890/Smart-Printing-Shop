const { getTeachers, addTeacher } = require("../controllers/teachers");

const teachersRoute = require("express").Router();

teachersRoute.get("/", getTeachers);
teachersRoute.post("/", addTeacher);

module.exports = teachersRoute;
