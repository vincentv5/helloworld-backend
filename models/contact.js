const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const Contact = new Schema({
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
 
  },{timestamp:true});



  exports.Contact=mongoose.model('contact',Contact);