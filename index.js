const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const port = process.env.PORT || 3000;
const indexRouter = require("./routes/index");

// Middleware Array
const middleware = [
	logger("dev"),
	cors(),
	express.static("public"),
	express.urlencoded({ extended: true }),
	express.json(),
	cookieParser(),
];

app.use(middleware);
app.use(indexRouter);

app.listen(port, () => {
	console.log(`Smart Printer app listening on port ${port}`);
});
