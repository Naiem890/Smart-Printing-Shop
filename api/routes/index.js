const teachersRoute = require("./teachers");
const shopsRoute = require("./shop");

const router = require("express").Router();

router.use("/teachers", teachersRoute);
router.use("/shops", shopsRoute);

module.exports = router;
