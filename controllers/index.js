const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const multer = require('multer');
const {User , Stocks} = require('../models');
const { hash, compare, auth} = require('../middleware');
require('../config')(passport);
const SECRET = "my secret";


const storage=multer.diskStorage({
	destination:function(req,file,cb){
		cb(null,'./uploads/');
	},

	filename:function(req,file,cb) {
		cb(null,new Date.now() + file.originalname);
	}
	
});

const fileFilter = (req,file,cb)=>{
		if(file.mimeType === 'image/jpg' || file.mimeType==='image/png') {
			cb(null,true);
		}else {
			cb(null,false);
		}
}

const upload=multer({
	storage:storage,
	limits:{
		fileSize:1024 *1024 *5,
	},
	fileFilter:fileFilter
})


router.route('/user/register').post((req,res,next)=> {
	const { email, password}=req.body;
	if(!email || !password) {
		return res.status(404).json({message:'invalide fields'});
	}else{
	User.find({}).then((val)=> {
		console.log(val.length)
		if(val.length > 0) {
			return res.status(404).json({message:'only one user is accepted'});
		}else {

	const NewUser = new User({
		email,
		password:hash(password)
	});
	NewUser
	.save()
	.then((data)=> {
		res
		.status(200)
		.json({message:'registered'});
	})
	.catch((err)=> {
		next(err);
	})

		}
	});

	}
	
});


router.route('/user/login').post((req,res,next)=> {
	const { email , password } = req.body;
	if(!email || !password) {
		return next('inputs can not be empty');
	}
	User.findOne({email:email})
	.then((data)=> {
		// json web token goes in here for sure
		if(compare(password,data.password)) {
			const token=jwt
			.sign(
				{body:data.email},
				SECRET
				);
			return res.status(200).json(token);
		}else{
			return next("invalid email password combination");
		}
     })
	.catch((err)=> {
		next(err);
	})


})


router
.route('/user/retrieve/password')
.patch((req,res,next)=> {
		const {email} = req.body;
		/// passsword will be sent to email
});


router
.route('/stocks')
.get((req,res,next)=> {
	Stocks
	.find({})
	.then((data)=> {
		res.status(200).json(data);
	})
	.catch((err)=> {
		next(err)
	})
})
.post(auth,upload.single('imageData'),(req,res,next)=> {
	const { title, stock, keys, price, description} = req.body;
	console.log(req.body.formData.file);
	if(!title || !stock || !keys || !price || !description) {
		return next('incorrect input combination');
	}

	const package = new Stocks({
		title,
		stock,
		licensekey:[...keys],
		description,
		price,
	
	});

	package.save()
	.then((data)=> {
		res.status(200).json(data);
	})
	.catch((err)=> {
		next(err);
	})
	
})
.patch(auth,(req,res,next)=>{
		const { id,title, stock, keys, price, description,image} = req.body
		if(!id || !keys || !title || !stock || !price || !description) {
		return next('incorrect input combination');
		}
		Stocks.update({_id:id},{
			$set:{
			title,
			stock,
			licensekey:keys,
			description,
			price,
			image
		}
		})
		.then((data)=> {
		res.status(200).json({message:'updated'});

		})
		.catch((err)=> {
			return next(err);
		})

})
router
.route('/stocks/:id')
.delete((req,res,next)=> {
		const id = req.params.id;
		if(!id) {
		return next('invalid id');
		}
		Stocks.findOneAndRemove({_id:id}).then((data)=> {
			res.status(200).json("deleted");
		}).catch((err)=> {
			return next(err)
		})
})


router.route('/stocks/payment').post((req,res,next)=> {

	const { id } = req.params;
	//reqest to payment api goes here
	const numberOfStock=2;
	const newStocks = Stocks.findOne({_id:id}).then((data)=> {
		const  extract = data.licensekey.splice(0,numberOfStock);
		 console.log(extract);
		return data.licensekey;
	}).catch((err)=> {
		return next(err);
	});

newStocks.then((data)=>{
		Stocks.updateOne({_id:id},{
			$set:{licensekey:data}
		})
		.then((data)=>res.status(200)
		.json({message:"some keys are removed"}))
		.catch((err)=>next(err))
}).catch((err)=>{
	return next(err);
})

	
})

router.route('/remove').get((req,res,next)=> {
	User.remove({}).then(()=> {
		return res.json("removed");
	});
})



module.exports=router;