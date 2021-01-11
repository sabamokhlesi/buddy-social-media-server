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
    followers: [{type: Schema.Types.ObjectId,ref:'User',unique: true}],
    followings: [{type: Schema.Types.ObjectId,ref:'User',unique: true}],
    commentsLeft:[{type: Schema.Types.ObjectId,ref:'Post'}]
  }
});

module.exports = mongoose.model('User', userSchema);
