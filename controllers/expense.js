const Expense = require("../models/Expense");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getExpenses = async (req, res) => {
    const { userId } = req.user;
    const expenses = await Expense.find({ createdBy: userId });
    res.status(StatusCodes.OK).json({ data: expenses, count: expenses.length });
};

const getExpense = async (req, res) => {
    const { expenseId } = req.params;
    const { userId } = req.user;
    // get expense that matches expense id and user id
    const expense = await Expense.find({ _id: expenseId, createdBy: userId });
    if (!expense) {
        throw new NotFoundError(`Expense with this ${expenseId} was not found`);
    }
    res.status(StatusCodes.OK).json({ data: expense });
};
// add expense, should include filters
const addExpense = async (req, res) => {
    const { userId } = req.user;
    req.body.createdBy = userId;
    const expense = await Expense.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ data: expense });
};

// remove expense
const removeExpense = async (req, res) => {
    const { expenseId } = req.params;
    const expense = await Expense.findOneAndDelete({
        _id: expenseId,
        createdBy: req.user.userId,
    });
    if (!expense) {
        throw new NotFoundError(`Expense with this ${expenseId} was not found`);
    }
    res.status(StatusCodes.OK).send();
};

// update expense
const updateExpense = async (req, res) => {
    const { expenseId } = req.params;
    const { userId } = req.user;
    const { name, cost, category, expenseDate } = req.body;
    console.log("entered here");
    if ((name === "" || cost === "" || category === "", expenseDate === "")) {
        throw new BadRequestError(
            "Name, cost, category or expense date cannot be left empty"
        );
    }
    const expense = await Expense.findOneAndUpdate(
        { _id: expenseId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    );
    if (!expense) {
        console.log("entered here into not found error");
        throw new NotFoundError(`Expense with this ${expenseId} was not found`);
    }
    res.status(StatusCodes.OK).json({ data: expense });
};

module.exports = {
    getExpenses,
    addExpense,
    removeExpense,
    updateExpense,
    getExpense,
};
