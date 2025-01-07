const { StatusCodes } = require("http-status-codes");

// having next in params is necessary for this run as an error handler, or else this middleware is skipped by pipeline.
const errorHandler = (err, req, res, next) => {
    console.log(err.message);
    let customError = {
        message: err.message || "Something went wrong please try again later",
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
    res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandler;
