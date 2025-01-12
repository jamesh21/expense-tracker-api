const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
    // get auth header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError(
            "Missing authorization header or bearer token"
        );
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, name: payload.name };
        console.log(req.user);
    } catch (error) {
        throw new UnauthenticatedError("Authentication invalid");
    }
    next();
};

module.exports = auth;
