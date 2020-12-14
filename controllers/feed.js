const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');


exports.getUser =(req,res,next) =>{
    const userName = req.params.userName
    User.findOne({"userInfo.userName":userName})
    .populate('userInfo.posts')
    .populate('userInfo.followers',['userInfo.userName','userInfo.avatarImgUrl','userInfo.name'])
    .populate('userInfo.followings',['userInfo.userName','userInfo.avatarImgUrl','userInfo.name'])
    .populate('userInfo.posts.comments.userId',['userInfo.userName','userInfo.avatarImgUrl','userInfo.name'])
    // .then(info=>console.log(info))
    .then(user=>
        res.status(200).json({
            message: 'Fetched user successfully.',
            userInfo:user.userInfo
        })
    )
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}