 const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const Stocks = new Schema({
    title:{
      type:String,
      require:true
    }, 
    description:{
      type:String,
      require:true
    },

    stock:{
      type:Number,
      require:true,
    },

     price:{
      type:Number,
      require:true,
    },

    licensekey:{
      type:Array,
      require
    },

    image:{
      type:String
    }

  },{timestamp:true});



  exports.Stocks=mongoose.model('stocks',Stocks);