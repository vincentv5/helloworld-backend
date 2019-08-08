const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { User,Stocks,Contact,Feedback,Images } = require('../models');
const { hash, compare, auth,SECRET,cleanUp,headersObj,coinbaseUrl} = require('../middleware');
const upload =require('../multerConfig');




//SENDING, GETING FILES AND DELETING FILES GOES BELOW HERE
router
.route('/multiple')
.post((req,res,next)=> {
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

}).get((req,res,next)=> {
	Images.findOne().then((data)=> {
		return res.status(200).json(data);
	}).catch((err)=>next(err));
})

router.route('/multiple/delete').post(async(req,res,next)=>{
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



//REGISTER USER GOES BELOW HERE
router
.route('/user/register')
.post((req,res,next)=> {
	const { email, password}=req.body;

	if(!trim(email) || !trim(password)) {
		return res.status(404).json({message:'invalide fields'});
	}else{
	User.find({}).then((val)=> {
		console.log(val.length)
		if(val.length > 0) {
			return res.status(404).json({message:'only one user is accepted'});
		}else {

	const NewUser = new User({
		email:cleanUp(email),
		password:cleanUp(hash(password))
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

//END OF REGISTRATION ROUTE


//LOGING USER IN AND AUTHENTICATION

router
.route('/user/login')
.post((req,res,next)=> {
	const { email , password } = req.body;
	if(!email || !password) {
		return next('inputs can not be empty');
	}
	User.findOne({email:cleanUp(email)})
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

//END OF LOGIN ROUTE


//RETRIEVING USERS PASSWORD OR PASSWORD RESET EMAIL WILL BE SENT BELOW HERE
router
.route('/user/retrieve/password')
.patch((req,res,next)=> {
		const {email} = req.body;
		/// passsword will be sent to email
});
//RETRIEVING PASSWORD ENDS HERE




//ADDING, UPDATING ,GETING ,DELETING STOCK GOES BELOW HERE
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



.post(auth,(req,res,next)=> {
	const { title, stock, keys, price, description,file} = req.body;

	if(!title || !stock || !keys || !price || !description) {
		return next('incorrect input combination');
	}

	const package = new Stocks({
		title:cleanUp(title),
		stock:cleanUp(stock),
		licensekey:[...keys],
		description,
		price:cleanUp(price),
		image:file
	
	});

	package.save()
	.then((data)=> {
		return res.status(200).json(data);
	})
	.catch((err)=> {
		return next(err);
	})
	
})

.patch(auth,(req,res,next)=>{
		const { id,title, stock, keys, price, description,file} = req.body
		if(!id || !keys || !title || !stock || !price || !description) {
		return next('incorrect input combination');
		}
		Stocks.update({_id:id},{
			$set:{
			title:title,
			stock:stock,
			licensekey:keys,
			description,
			price:price,
			image:file
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

//END OF STOCK ROUTES




// router
// .route('/remove')
// .get((req,res,next)=> {
// 	Images.remove({})
// 	.then(()=> {
// 		return res.status(200).json({message:"removed"});
// 	});
// })





//SENDING UPDATING DELETING AND GETING CONTACT GOES BELOW
router
.route('/contact')
.post((req,res,next)=> {
	const { name, email,message} = req.body;
	if(!name || !email || !message) {
		return res
		.status(404)
		.json({message:'can not handle empty object'})
	}
	const newContact = new Contact({
		name:cleanUp(name),
		email:cleanUp(email),
		message:message
	});

	newContact
	.save()
	.then((data)=> {
		return res
		.status(200)
		.json({message:'success'})
	})
	.catch((err)=> {
		return next(err);
	})

})
.get((req,res,next)=> {
	const result =Contact.find({})
	.then((data)=> {
		return res.status(200).json(data);
	})
	.catch((err)=> {
		return next(err);
	})

})
router
.route('/contact/:id')
.patch((req,res,next)=> {
	const { id }=req.params;
		Contact.update({_id:id},{
		$set:{
			isChecked:true
		}
		}).then((data)=>{
			return res
			.status(200)
			.json({message:'updated'})
		})
		.catch((err)=>{
			return next(err);
		})
})

router
.route('/contact/:id')
.delete((req,res,next)=> {
	const id = req.params.id;
		if(!id) {
		return next('invalid id');
		}
		Contact
		.findOneAndRemove({_id:id})
		.then((data)=> {
			return res
			.status(200)
			.json("deleted");
		}).catch((err)=> {
			return next(err)
		})
});
//END OF CONTACT



//SENDING DELETING UPDATING FEEDBACKS GOES BELOW 
router
.route('/feedback')
.post((req,res,nex)=> {
	const { name , email , message }= req.body;
	if(!name || !email || !message) {
		return res
		.status(404)
		.json({message:'can not handle empty object'});
	}

	const newFeedback = new Feedback({
		name:cleanUp(name),
		email:cleanUp(email),
		message:message
	});

	newFeedback.save().then((data)=> {
		return res.status(200).json({message:'success'});
	}).catch((err)=> {
		return next(err);
	})

})
.get((req,res,next)=> {
	const result =Feedback.find({})
	.then((data)=> {
		return res.status(200).json(data);
	})
	.catch((err)=> {
		return next(err);
	})
})

router
.route('/feedback/:id')
.patch((req,res,next)=> {
	const { id }=req.params;
		Feedback.update({_id:id},{
		$set:{
			isChecked:true
		}
		}).then((data)=>{
			return res.status(200).json({message:'updated'})
		})
		.catch((err)=>{
			return next(err);
		})
})

router
.route('/feedback/:id')
.delete((req,res,next)=> {
	const id = req.params.id;
		if(!id) {
		return next('invalid id');
		}
		Feedback
		.findOneAndRemove({_id:id})
		.then((data)=> {
			res.status(200).json("deleted");
		}).catch((err)=> {
			return next(err)
		})
});

//END OF FEED BACK




// COINBASE API REQUEST TO CREATE CHARGE AND CONCEL CHARGE GOES BELOW THIS ROUTINGS

router.route('/charges').post((req,res,next)=> {
	const {title,description,clientAmount,email } = req.body;
	return fetch(`${coinbaseUrl}/charges`,headersObj(title,description,clientAmount,email))
	.then((res)=> {
		return res.json();
	}).then((values)=> {
	return res.status(200).json(values.data)
		
	})
	.catch((err)=>next(err));
})

router.route('/charges/:id/cancel').post((req,res,next)=> {
const { id }=req.params;
return fetch(`${coinbaseUrl}/charges/${id}/cancel`,{
		method:'post'
	})
	.then(res=>res.json())
	.then(result=>res.status(200).json({message:'charge canceled!!!'}))
	.catch(err=>next(err));
})


router.route('/coinbase/cancel').post((req,res,next)=> {
	console.log(res.body);

})

router.route('/coinbase/webhook').post((req,res,next)=> {
	console.log(res.body);

})




//END OF COINBASE API CALLS




//HANDLING COINBASE PAYMENT GOES DOWN BELOW HERE

router
.route('/stocks/payment')
.post((req,res,next)=> {
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

newStocks
.then((data)=>{
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








module.exports=router;