require("dotenv").config();
// library that wraps all async function in try catch block
require("express-async-errors");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const authRouter = require("./routes/auth");
const expenseRouter = require("./routes/expense");
const connectDB = require("./db/connect");
const authenticateMiddleware = require("./middleware/authentication");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
// middleware
app.use(express.json());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/expense", authenticateMiddleware, expenseRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
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
