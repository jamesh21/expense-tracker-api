require("dotenv");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const authRouter = require("./routes/auth");
const expenseRouter = require("./routes/expense");
// middleware
app.use(express.json());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/expenses", expenseRouter);

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
});
