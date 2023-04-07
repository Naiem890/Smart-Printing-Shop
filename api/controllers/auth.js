const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const Session = require("../../models/Session");
const User = require("../../models/User");
const { usernameGenerating, isValidEmail } = require("../../utils/helper");
const { createToken } = require("../../utils/jwt");

exports.login = async (req, res, next) => {
	try {
		const error = {};
		const { email, password } = req.body;
		if (email) {
			const isUserExists = await User.exists({ email }).select(
				"password email"
			);

			if (isUserExists) {
				if (password) {
					const matched = bcrypt.compareSync(
						password,
						isUserExists.password
					);
					if (matched) {
						const sessionUUID = uuid();
						const expireDate = new Date();
						expireDate.setDate(expireDate.getDate() + 30);
						const newSession = new Session({
							user: isUserExists._id,
							sessionUUID,
							expireDate,
						}).save();
						const jwToken = createToken(
							isUserExists._id,
							sessionUUID
						);
						res.json({ token: jwToken, email: isUserExists.email });
					} else {
						error.password = "Password is wrong!";
					}
				} else {
					error.password = "Please provide your password!";
				}
			} else {
				error.email = "There is no associated account with this email!";
			}
		} else {
			error.email = "Please enter your email!";
		}
		if (!res.headersSent) {
			res.status(400).json({ error });
		}
	} catch (error) {
		next(error);
	}
};
exports.signup = async (req, res, next) => {
	try {
		let { fullName, email, password, username } = req.body;
		const newUser = new User({ fullName, username, email, password });
		const result = await newUser.save();
		return res.status(201).json({
			user: {
				_id: result._id,
				username: result.username,
				fullName: result.fullName,
				email: result.email,
			},
		});
	} catch (error) {
		next(error);
	}
};
exports.logout = (req, res, next) => {
	res.send("logout");
};
