const express = require('express');
const auth = require('../middleware/auth');
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');

const router = express.Router();

router.post('/', auth, createExpense);
router.get('/', auth, getExpenses);
router.put('/:id', auth, updateExpense);
router.delete('/:id', auth, deleteExpense);

module.exports = router;