const express = require("express");
const router = express.Router();
const {
    getExpenses,
    addExpense,
    removeExpense,
    updateExpense,
} = require("../controllers/expense");

router.route("/").get(getExpenses).post(addExpense);
router.route("/:expenseId").delete(removeExpense).patch(updateExpense);
module.exports = router;
