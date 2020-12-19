const express = require('express');
const { body } = require('express-validator');

const feed = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/users/:userName',feed.getUser)
router.get('/posts/:userId',isAuth,feed.getFeedPosts)
router.get('/search-users/:searchedKey',isAuth,feed.findUsers)

module.exports = router;
