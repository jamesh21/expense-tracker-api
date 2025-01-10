const Expense = require("../models/Expense");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getExpenses = async (req, res) => {
    const { userId } = req.user;
    const { timeFilter, categoryFilter, startDate, endDate } = req.query;
    const queryObject = {
        createdBy: userId,
    };
    if (timeFilter) {
        queryObject.expenseDate = buildPresetTimeQuery(timeFilter);
    }
    if (categoryFilter) {
        queryObject.category = categoryFilter;
    }
    if (startDate || endDate) {
        // custom time filter
        queryObject.expenseDate = buildCustomTimeQuery(startDate, endDate);
    }
    // pagination
    let result = Expense.find(queryObject);
    const limit = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const expenses = await result;
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

const buildPresetTimeQuery = (timeFilter) => {
    const now = new Date();
    let start;
    if (timeFilter === "week") {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (timeFilter === "month") {
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (timeFilter === "3month") {
        start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    } else {
        // incorrect timefilter throw error
        throw new BadRequestError(
            "Passed in incorrect time filter as query parameter"
        );
    }
    return { $gt: start, $lte: now };
};

const buildCustomTimeQuery = (startDate, endDate) => {
    if (!startDate) {
        // only endDate is filled, throw error
        throw new BadRequestError("Please pass in startDate parameter");
    }
    let start, now;
    // end date is empty, take current time is end date
    if (!endDate) {
        now = new Date();
    } else {
        // both start and end is filled
        now = new Date(endDate);
    }
    start = new Date(startDate);
    return { $gte: start, $lte: now };
};

module.exports = {
    getExpenses,
    addExpense,
    removeExpense,
    updateExpense,
    getExpense,
};
