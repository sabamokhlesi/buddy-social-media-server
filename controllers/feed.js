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
    .populate({
        path : 'userInfo.posts',
        populate : {
          path : 'comments.userId',
          select: ['userInfo.userName','userInfo.avatarImgUrl','userInfo.name']
        }
      })
    .populate({
        path : 'userInfo.posts',
        populate : {
            path : 'creator',
            select: ['userInfo']
        }
    })
    // .populate('userInfo.posts.comments.userId',['userInfo.userName','userInfo.avatarImgUrl','userInfo.name'])
    // .then(info=>console.log(info))
    .then(user=>
        res.status(200).json({
            message: 'Fetched user successfully.',
            userInfo:{...user.userInfo,_id:user._id.toString()}
        })
    )
    .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}

exports.getFeedPosts = (req, res, next) => {
  // const currentPage = req.query.page || 1;
  // const perPage = 50;
  // const fromDate = req.query.fromDate
  // const toDate = req.query.toDate
  const userId = req.params.userId
  let totalItems;
  User.find({'userInfo.followers':userId})
    .countDocuments()
    .then(count => {
        if(!count>1){
            res.status(200).json({message:'You are not following anyone',totalItems:count})
        }
      totalItems = count;
      return User.find({'userInfo.followers':userId},['userInfo.posts'])
      .populate('userInfo.posts')
      .populate({
        path : 'userInfo.posts',
        populate : {
          path : 'comments.userId',
          select: ['userInfo.userName','userInfo.avatarImgUrl','userInfo.name']
        }
      })
    .populate({
        path : 'userInfo.posts',
        populate : {
            path : 'creator',
            select: ['userInfo.userName','userInfo.name','userInfo.avatarImgUrl']
        }
    })
    // .populate('comments.userId',['userInfo.userName','userInfo.avatarImgUrl','userInfo.name'])
      .sort({ 'userInfo.posts.createdAt': -1 })
        // .skip((currentPage - 1) * perPage)
        // .limit(perPage);
    })
    .then(result => {
      const posts =[]
      result.map(user=>user.userInfo.posts.map(post=>posts.push(post)))
      res.status(200).json({
        message: 'Fetched posts successfully.',
        posts: posts
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
