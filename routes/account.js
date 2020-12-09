const express = require('express');
const { body } = require('express-validator');

const account = require('../controllers/account');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// POST /account/post
router.post('/post',isAuth,account.createPost)

// router.put(
//   '/transaction',
//   isAuth,
//   [
//     body('title').trim().isLength({ min: 1 }),
//     body('amount').trim().isLength({ min: 1 }),
//     body('category').trim().isLength({ min: 1 }),
//     body('date').trim().isLength({ min: 1 }),
//     body('person').trim().isLength({ min: 1 }),
//     body('type').trim().isLength({ min: 1 }),
//     body('userId').trim().isLength({ min: 1 })
//   ],
//   budgetController.updateTransaction
// );

// router.delete('/transaction/:transactionId', isAuth,budgetController.deleteTransaction);

router.get('/user-info/:userId',isAuth,account.getUserInfo)
router.put('/user-info/:userId',isAuth,account.updateUserInfo)

// // GET /budget-manager/transactions
router.get('/posts/:userId', isAuth, account.getPosts);
// router.get('/transaction/:transactionId',isAuth, budgetController.getTransaction);

module.exports = router;
