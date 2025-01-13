require("dotenv").config();
// library that wraps all async function in try catch block
require("express-async-errors");
const rateLimiter = require("express-rate-limit");
const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const expenseRouter = require("./routes/expense");
const connectDB = require("./db/connect");
const authenticateMiddleware = require("./middleware/authentication");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
// security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
app.set("trust proxy", 1); // if using rate limiter with reverse proxy, this needs to be included
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);
// middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/expense", authenticateMiddleware, expenseRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`server is listening on port ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
};

startServer();
