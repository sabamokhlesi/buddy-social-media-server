const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  // console.log(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = 'images/'+req.file.path.slice(7);
  const caption = req.body.caption;
  let creator;
  const post = new Post({
    caption: caption,
    imageUrl: imageUrl,
    likes:[],
    comments:[],
    creator: req.userId
  });
  post.save()
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.userInfo.posts.push(post);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: post,
        creator: { _id: creator._id, userName: creator.userName }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

  exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    let userId
    Post.findById(postId)
      .then(post => {
        if (!post) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        userId = post.creator.toString()
        if (!userId) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
        } else {
          clearImage(post.imageUrl)
        }
        return Post.findByIdAndRemove(postId);
      })
      .then(result => {
        // User.update( 
        //   {_id: userId}, 
        //   { userInfo:{$pull: {posts: postId} } }
        // )
        return User.findById(userId);
      })
      .then(user => {
        user.userInfo.posts.pull(postId);
        return user.save();
      })
      .then(result => {
        res.status(200).json({ message: 'Deleted post.' });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
  
  exports.postComment = (req, res, next) => {
    const postId = req.params.postId
    const userId = req.body.userId
    const comment = req.body.comment
    
    Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('post not found.');
        error.statusCode = 401;
        throw error;
      }
      post.comments.push({userId:userId,content:comment})
      return post.save()
    })
      .then(result => {
        res.status(201).json({
          message: 'Comment added successfully!',
          _id: result._id.toString()
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

// exports.updateTransaction = (req, res, next) => {
//     const transactionId = req.body._id;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const error = new Error('Validation failed, entered data is incorrect.');
//       error.statusCode = 422;
//       throw error;
//     }
//     const title = req.body.title;
//     const amount = req.body.amount;
//     const type = req.body.type;
//     const category = req.body.category;
//     const date = req.body.date;
//     const person = req.body.person;
//     const note = req.body.note;
//     const userId = req.body.userId
//     // if (req.file) {
//     //   imageUrl = req.file.path;
//     // }
//     // if (!imageUrl) {
//     //   const error = new Error('No file picked.');
//     //   error.statusCode = 422;
//     //   throw error;
//     // }
//     Post.findById(transactionId)
//       .then(transaction => {
//         if (!transaction) {
//           const error = new Error('Could not find transaction.');
//           error.statusCode = 404;
//           throw error;
//         }
//         if (transaction.userId.toString() !== req.userId) {
//           const error = new Error('Not authorized!');
//           error.statusCode = 403;
//           throw error;
//         }
//         // if (imageUrl !== post.imageUrl) {
//         //   clearImage(post.imageUrl);
//         // }
//         transaction.title = title;
//         transaction.amount = amount;
//         transaction.type = type;
//         transaction.category = category;
//         transaction.date = date;
//         transaction.person = person;
//         transaction.note = note;
//         transaction.userId= userId;
//         return transaction.save();
//       })
//       .then(result => {
//         res.status(200).json({ message: 'transaction updated!', transaction: result });
//       })
//       .catch(err => {
//         if (!err.statusCode) {
//           err.statusCode = 500;
//         }
//         next(err);
//       });
//   };

//   exports.getTransaction = (req, res, next) => {
//     const transactionId = req.params.transactionId;
//     Post.findById(transactionId)
//       .then(transaction => {
//         if (!transaction) {
//           const error = new Error('Could not find transaction.');
//           error.statusCode = 404;
//           throw error;
//         }
//         res.status(200).json({ message: 'transaction fetched.', transaction: transaction });
//       })
//       .catch(err => {
//         if (!err.statusCode) {
//           err.statusCode = 500;
//         }
//         next(err);
//       });
//   };
  

  exports.getPosts = (req, res, next) => {
    // const currentPage = req.query.page || 1;
    // const perPage = 50;
    // const fromDate = req.query.fromDate
    // const toDate = req.query.toDate
    const userId = req.params.userId
    let totalItems;
    Post.find({creator:userId})
      .countDocuments()
      .then(count => {
          if(!count>1){
              res.status(200).json({message:'No post found',totalItems:count})
          }
        totalItems = count;
        return Post.find({creator:userId}).sort({ createdAt: -1 })
        .populate('creator',['userInfo'])
        .populate('comments.userId',['userInfo.userName','userInfo.avatarImgUrl','userInfo.name'])
          // .skip((currentPage - 1) * perPage)
          // .limit(perPage);
      })
      .then(updatedPosts => {
        res.status(200).json({
          message: 'Fetched posts successfully.',
          posts: updatedPosts
        });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.getUserInfo = (req,res,next)=>{
    const userId = req.params.userId
    User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error('user not found.');
        error.statusCode = 401;
        throw error;
      }
      return user.userInfo
    })
    .then(userInfo => {
      res.status(200).json({
        message: 'Fetched user information successfully.',
        userInfo:userInfo
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  }

  exports.updateUserInfo = (req,res,next)=>{
    const userId = req.params.userId
    const avatarImgUrl = req.file?'images/'+req.file.path.slice(7):'';
    const name = req.body.name;
    const bio = req.body.bio
    User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error('user not found.');
        error.statusCode = 401;
        throw error;
      }
      user.userInfo.bio = bio
      user.userInfo.name = name
      avatarImgUrl!==''?clearImage(user.userInfo.avatarImgUrl):null
      avatarImgUrl!==''?user.userInfo.avatarImgUrl = avatarImgUrl:null
      return user.save()
    })
    .then(user=> {
      res.status(200).json({
        message: 'Updated user information successfully.',
        userInfo:{name:user.userInfo.name,bio:user.userInfo.bio,avatarImgUrl:user.userInfo.avatarImgUrl}
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
  }

  exports.likeDislikePost = (req, res, next) => {
    const action = req.query.action
    const userId = req.query.userId
    const postId = req.params.postId
    
    Post.update( 
      {_id: postId}, 
      action!=='like'?
      { $pull: {likes: userId } }
      :{ $push: {likes: userId } }
    )
      .then(result => {
        res.status(200).json({ message: action+'successfull!'});
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

  exports.followUnfollowUser = (req, res, next) => {
    const action = req.query.action
    const userId = req.params.userId
    const followingUserId = req.query.followingUserId
    
    User.update( 
      {_id: userId}, 
      action!=='follow'?
      { $pull: {'userInfo.followings': followingUserId } }
      :{ $push: {'userInfo.followings': followingUserId } }
    )
    User.update( 
      {_id: followingUserId}, 
      action!=='follow'?
      { $pull: {'userInfo.followers': userId } }
      :{ $push: {'userInfo.followers': userId } }
    )
      .then(result => {
        res.status(200).json({ message: action+'successfull!'});
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };