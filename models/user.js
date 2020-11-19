const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {type: String,required: true},
  password:{type: String,required: true},
  budgetInfo:{
    categories:{type:Object},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true}
  },
  transactions: [{type: Schema.Types.ObjectId,ref:'Transaction'}]
});

module.exports = mongoose.model('User', userSchema);
