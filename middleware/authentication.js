const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
    // get auth header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("no token provided");
        // throw error
        throw new Error("No token provided");
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, name: payload.name };
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
    // happy path
    next();
};

module.exports = auth;
