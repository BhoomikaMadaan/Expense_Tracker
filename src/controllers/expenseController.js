const Expense = require('../models/Expense');

const createExpense = async (req, res) => {
  const { amount, category, date, note } = req.body;
  
  const expense = new Expense({
    userId: req.user.id,
    amount,
    category,
    date,
    note
  });
  
  await expense.save();
  res.json(expense);
};

const getExpenses = async (req, res) => {
  const expenses = await Expense.find({ userId: req.user.id });
  res.json(expenses);
};

const updateExpense = async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  
  if (!expense) {
    return res.json({
      success: false,
      message: 'Expense not found' 
    });
  }
  
  res.json(expense);
};

const deleteExpense = async (req, res) => {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });
  
  if (!expense) {
    return res.json({ 
      success: false,
      message: 'Expense not found' 
    });
  }
  
  res.json({ 
    success: true,  
    message: 'Expense deleted' 
  });
};

module.exports = { createExpense, getExpenses, updateExpense, deleteExpense };