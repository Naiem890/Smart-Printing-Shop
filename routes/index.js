const router = require("express").Router();
const apiRoutes = require("./../api/routes/index");

router.all("/", (req, res) => {
	res.send("server running");
});

router.use("/api", apiRoutes);

// catch 404 and forward to error handler
router.use((req, res, next) => {
	return res.status(404).json({
		error: { message: "404 | Resource not found!", statusCode: 404 },
	});
});

// error handler
router.use((err, req, res, next) => {
	console.error(err);

	const statusCode = err.status || 500;
	const error = {
		message: err.message,
		stack: process.env.NODE_ENV !== "production" ? err.stack : "",
	};

	res.status(statusCode).json(error);
});

module.exports = router;
