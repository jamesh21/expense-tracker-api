const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
    // retrieve name, email, password
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        console.log("Need more info");
        // throw an error
    }
    // create user in mongodb
    const user = await User.create({ ...req.body });
    if (!user) {
        console.log("no user created");
        // throw error
    }
    // create token
    const token = user.createJWT();
    // return token
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
    // retrieve email and password
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("Need more info");
        // throw an error
    }
    // get user from mongo db
    const user = await User.findOne({ email });
    if (!user) {
        console.log("no user found");
        // throw an error
    }
    // compare password
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
        console.log("wrong password");
        // throw an error
    }
    const token = user.createJWT();
    // return token
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
