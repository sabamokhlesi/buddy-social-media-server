const express = require('express');
const { body } = require('express-validator');

const account = require('../controllers/account');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// POST /account/post
router.post('/post',isAuth,account.createPost)
router.post('/comment/:postId',isAuth,account.postComment)
router.put('/post/:postId',isAuth,account.likeDislikePost);
router.put('/followings/:userId',isAuth,account.followUnfollowUser)

router.delete('/post/:postId', isAuth,account.deletePost);

router.get('/user-info/:userId',isAuth,account.getUserInfo)
router.put('/user-info/:userId',isAuth,account.updateUserInfo)

// // GET /account
router.get('/posts/:userId', isAuth, account.getPosts);
// router.get('/transaction/:transactionId',isAuth, budgetController.getTransaction);

module.exports = router;
