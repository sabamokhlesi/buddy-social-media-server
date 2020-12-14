const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    createdAt: {type:Date, default:Date.now},
    caption:{type: String},
    imageUrl:{type: String,required: true},
    creator: {type: Schema.Types.ObjectId, ref:'User',required: true},
    likes:[{type: Schema.Types.ObjectId, ref:'User'}],
    comments:[{
      userId:{type: Schema.Types.ObjectId, ref:'User',required: true},
      content:{type: String,required: true},
      date:{type:Date, default:Date.now }
    }]
  });

module.exports = mongoose.model('Post', postSchema);
