const teachersRoute = require("./teachers");

const router = require("express").Router();

router.use("/teachers", teachersRoute);


module.exports = router;
