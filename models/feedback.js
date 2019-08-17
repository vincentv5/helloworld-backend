const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const Feedback = new Schema({
    name:{
      type:String,
      require:true
    }, 
    message:{
      type:String,
      require:true
    },

    email:{
      type:String,
      require:true,
    },

    isChecked:{
      type:Boolean,
      default:false,
    },
 
  },{timestamps: true});



  exports.Feedback=mongoose.model('feedback',Feedback);