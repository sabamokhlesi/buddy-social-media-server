const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');
const user = require('../models/user');


exports.getUser =(req,res,next) =>{
    const userName = req.params.userName
    User.findOne({"userInfo.userName":userName})
    .then(user=>
        res.status(200).json({
            message: 'Fetched user successfully.',
            userInfo:user.userInfo 
        })
    )
}