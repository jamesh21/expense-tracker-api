const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name of expense"],
    },
    cost: {
        type: Number,
        required: [true, "Please provide cost for expense"],
        min: 1,
    },
    category: {
        type: String,
        enum: [
            "groceries",
            "leisure",
            "electronics",
            "utilities",
            "clothing",
            "health",
            "other",
        ],
        required: [true, "Please provide category for expense"],
    },
    expenseDate: {
        type: Date,
        required: [true, "Please provide date for this expense"],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide user"],
    },
});

// formatting cost to US currency formata
ExpenseSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
        ret.priceInDollars = (ret.cost / 100).toFixed(2); // Add price in dollars
        delete ret.cost; // Optionally, remove the raw price field
        return ret;
    },
});

module.exports = mongoose.model("Expense", ExpenseSchema);
