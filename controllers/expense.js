const getExpenses = async (req, res) => {
    res.send("get expense");
};

// add expense
const addExpense = async (req, res) => {
    res.send("add expense");
};
// remove expense
const removeExpense = async (req, res) => {
    res.send("remove expense");
};
// update expense
const updateExpense = async (req, res) => {
    res.send("update expense");
};

module.exports = { getExpenses, addExpense, removeExpense, updateExpense };
