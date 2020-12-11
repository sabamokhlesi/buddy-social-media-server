const express = require('express');
const { body } = require('express-validator');

const account = require('../controllers/account');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// POST /account/post
router.post('/post',isAuth,account.createPost)

router.put('/post/:postId',isAuth,account.likeDislikePost);

router.delete('/post/:postId', isAuth,account.deletePost);

router.get('/user-info/:userId',isAuth,account.getUserInfo)
router.put('/user-info/:userId',isAuth,account.updateUserInfo)

// // GET /budget-manager/transactions
router.get('/posts/:userId', isAuth, account.getPosts);
// router.get('/transaction/:transactionId',isAuth, budgetController.getTransaction);

module.exports = router;
