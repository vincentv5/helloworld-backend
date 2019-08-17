const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const Images = new Schema({ 
    path:{
      type:Array,
      require:true
    },

  },{timestamps: true});



   exports.Images=mongoose.model('images',Images);