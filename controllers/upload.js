const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const {Images} = require('../models');
const { auth } = require('../middleware');
const upload =require('../multerConfig');




//SENDING, GETING FILES AND DELETING FILES GOES BELOW HERE
router
.route('/multiple')
.post(auth,(req,res,next)=> {
upload(req, res,async function (err) {
       if (err instanceof multer.MulterError) {
           return res.status(500).json(err)
       } else if (err) {
           return res.status(500).json(err)
       }
       	 try{

			let checkImage = await Images.findOne();
			if(checkImage === null) {
				const newImage = new Images({
					path:req.files
				})
				const result = await newImage.save();
				if(result) {
					return res
					.status(200)
					.json({message:'success'})
				}else {
					return res
					.status(404)
					.json({message:'oops something went wrong'})
				}

			}else {

				const updateImage = await Images
				.update({_id:checkImage._id},{
					$set:{
						path:[...checkImage.path, ...req.files]
					}
				});

				if(updateImage) {
					return res
					.status(200)
					.json({message:'success'});
				}else {
					return res
					.status(404)
					.json({message:'oops something went wrong'})
				}
			}
       	 }
       	 catch(err){
			return next(err);
       	 }
    });

}).get(auth,(req,res,next)=> {
	Images.findOne().then((data)=> {
		return res.status(200).json(data);
	}).catch((err)=>next(err));
})

router.route('/multiple/delete').post(auth,async(req,res,next)=>{
const {file} = req.body;

if(file){
fs.unlink(file,function(err){if(err) return next(err)})
try{

	const value =await Images.findOne();
	let path=null;
	value.path.forEach((val,i)=>{if(val.path === file) path=i; return;});

	if(path !== null) {
		value.path.splice(path,1);
		const updateFile = await Images.update({_id:value._id},{
			$set:{
				path:value.path
			}
		})

		if(updateFile)
			return res.status(200).json({message:'deleted'})

	} 

}catch(err) {
	return next(err);
}

}
return next({message:'no file sent for deletion'});
});

//END OF FILES ROUTES

module.exports=router;