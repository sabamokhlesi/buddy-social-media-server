const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String,required: true},
  password:{type: String,required: true},
  userName:{type:String,required:true},
  userInfo:{
    name:{type: String},
    Bio:{type: String},
    posts:[{type: Schema.Types.ObjectId,ref:'Posts'}],
    followers: [{type: Schema.Types.ObjectId,ref:'Users'}],
    followings: [{type: Schema.Types.ObjectId,ref:'Users'}],
  }
});

module.exports = mongoose.model('User', userSchema);
