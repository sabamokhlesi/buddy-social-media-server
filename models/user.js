const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String,required: true},
  password:{type: String,required: true},
  userInfo:{
    userName:{type:String,required:true},
    name:{type: String},
    bio:{type: String},
    avatarImgUrl:{type:String},
    posts:[{type: Schema.Types.ObjectId,ref:'Post'}],
    follower: [{type: Schema.Types.ObjectId,ref:'User'}],
    followings: [{type: Schema.Types.ObjectId,ref:'User'}],
  }
});

module.exports = mongoose.model('User', userSchema);
