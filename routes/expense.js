const express = require("express");
const router = express.Router();
const {
    getExpenses,
    addExpense,
    removeExpense,
    updateExpense,
    getExpense,
} = require("../controllers/expense");

router.route("/").get(getExpenses).post(addExpense);
router
    .route("/:expenseId")
    .get(getExpense)
    .delete(removeExpense)
    .patch(updateExpense);
module.exports = router;
