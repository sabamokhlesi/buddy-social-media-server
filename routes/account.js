const express = require('express');
const { body } = require('express-validator');

const budgetController = require('../controllers/budget-manager');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// POST /budget-manager/transaction
router.post(
  '/transaction',
  isAuth,
  [
    body('title').trim().isLength({ min: 1 }),
    body('amount').trim().isLength({ min: 1 }),
    body('category').trim().isLength({ min: 1 }),
    body('date').trim().isLength({ min: 1 }),
    body('person').trim().isLength({ min: 1 }),
    body('type').trim().isLength({ min: 1 }),
    body('userId').trim().isLength({min:1})
  ],
  budgetController.createTransaction
);

router.put(
  '/transaction',
  isAuth,
  [
    body('title').trim().isLength({ min: 1 }),
    body('amount').trim().isLength({ min: 1 }),
    body('category').trim().isLength({ min: 1 }),
    body('date').trim().isLength({ min: 1 }),
    body('person').trim().isLength({ min: 1 }),
    body('type').trim().isLength({ min: 1 }),
    body('userId').trim().isLength({ min: 1 })
  ],
  budgetController.updateTransaction
);

router.delete('/transaction/:transactionId', isAuth,budgetController.deleteTransaction);

router.get('/budget-info/:userId',isAuth,budgetController.getUserBudgetInfo)
router.put('/budget-info/:userId',isAuth,budgetController.updateUserBudgetInfo)

// GET /budget-manager/transactions
router.get('/transactions/:userId', isAuth, budgetController.getTransactions);
router.get('/transaction/:transactionId',isAuth, budgetController.getTransaction);

module.exports = router;
