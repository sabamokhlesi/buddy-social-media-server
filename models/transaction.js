const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    // title: {type: String,required: true },
    // amount: {type: String,required: true},
    // category: {type: String,required: true},
    // date: {type: String,required: true},
    // person: {type: String,required: true},
    // type: {type: String,required: true},
    // note: {type: String},
    userId: {type: Schema.Types.ObjectId,ref: 'User',required: true}
  });

module.exports = mongoose.model('post', postSchema);
