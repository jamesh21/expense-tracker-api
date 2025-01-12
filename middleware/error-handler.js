const { StatusCodes } = require("http-status-codes");

// having next in params is necessary for this run as an error handler, or else this middleware is skipped by pipeline.
const errorHandler = (err, req, res, next) => {
    let customError = {
        message: err.message || "Something went wrong please try again later",
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    };
    // mongoose errors
    if (err.name === "ValidationError") {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        customError.message = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
    }
    if (err.code && err.code === 11000) {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        customError.message = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value`;
    }
    if (err.name === "CastError") {
        customError.message = `No item found with id : ${err.value}`;
        customError.statusCode = StatusCodes.NOT_FOUND;
    }
    res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandler;
