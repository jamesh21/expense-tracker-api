require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const authRouter = require("./routes/auth");
const expenseRouter = require("./routes/expense");
const connectDB = require("./db/connect");
// middleware
app.use(express.json());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/expenses", expenseRouter);

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
