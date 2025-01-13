const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequestError } = require("../errors");

const register = async (req, res) => {
    // create user in mongodb
    const user = await User.create({ ...req.body });
    // create token
    const token = user.createJWT();
    // return token
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
    // retrieve email and password
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }
    // get user from mongo db
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError(
            "User not found, Please provide valid email address"
        );
    }
    // compare password
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
        throw new UnauthenticatedError("wrong password entered");
    }
    const token = user.createJWT();
    // return token
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
