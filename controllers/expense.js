const Expense = require("../models/Expense");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

/**
 * Retrieves a list of expense for signed in user matching the query parameters passed in.
 * The returned list can be paginated. It will default to 10 items on page 1 if nothing is passed in.
 * Returns a list of expenses matching the passed in filters.
 * @param {*} req
 * @param {*} res
 */
const getExpenses = async (req, res) => {
    const { userId } = req.user;
    const { time, category, startDate, endDate } = req.query;
    const queryObject = {
        createdBy: userId,
    };
    if (time) {
        queryObject.expenseDate = buildPresetTimeQuery(time);
    }
    if (category) {
        queryObject.category = category;
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

/**
 * Retrieves the expense matching the expense Id passed in through request parameters.
 * The expense will only be returned if expense Id is valid and belongs to the current signed in user
 * Returns the matching expense
 * @param {*} req
 * @param {*} res
 */
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

/**
 * Adds a new expense using the request body data passed in.
 * The expense will only be returned if expense Id is valid and belongs to the current signed in user
 * Returns the newly added expense
 * @param {*} req
 * @param {*} res
 */
const addExpense = async (req, res) => {
    const { userId } = req.user;
    req.body.createdBy = userId;
    const expense = await Expense.create({ ...req.body });
    res.status(StatusCodes.CREATED).json({ data: expense });
};

/**
 * Removes the expense that matches expense ID passed in and belongs to current signed in user
 * @param {*} req
 * @param {*} res
 */
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

/**
 * Updates the expense matching expense ID passed in. Name/cost/category/expense date cannot be left blank
 * Returns the newly updated expense
 * @param {*} req
 * @param {*} res
 */
const updateExpense = async (req, res) => {
    const { expenseId } = req.params;
    const { userId } = req.user;
    const { name, cost, category, expenseDate } = req.body;

    if (name === "" || cost === "" || category === "" || expenseDate === "") {
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
        throw new NotFoundError(`Expense with this ${expenseId} was not found`);
    }
    res.status(StatusCodes.OK).json({ data: expense });
};

/**
 * Builds the start and end date used to query mongoose. These filters are preset
 * Returns an object with start and end date used for mongoose query
 * @param {*} timeFilter - String that will determine the time frame for start and end date
 */
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

/**
 * Builds the start and end date used to query mongoose. These filters are custom.
 * Returns an object with start and end date used for mongoose query
 * @param {*} startDate - String that will determine the time frame for start date
 * @param {*} endDate - String that will determine the time frame for end date
 */
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
