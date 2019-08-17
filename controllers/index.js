const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User} = require('../models');
const { hash, compare, auth,SECRET,cleanUp} = require('../middleware');

//REGISTER USER GOES BELOW HERE
router
.route('/user/register')
.post(async(req,res,next)=> {
	const { email, password}=req.body;
	if(!email || !password) 
		return res.status(404).json({message:'invalide fields'});
	
try {
	const user = await User.findOne();
		if(user) {
			return res.status(404).json({message:'only one user is accepted'});
		}
		const NewUser = await new User({
			email:cleanUp(email),
			password:cleanUp(hash(password))
		});
		const result = await NewUser.save();
		if(result)
			return res.status(200).json({message:'registered'});
		return res.status(404).json({message:'ooop something went wrong'});

}catch(err) {
	return next(err);
}	

});

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




//RETRIEVING USERS PASSWORD OR PASSWORD RESET EMAIL WILL BE SENT BELOW HERE
router
.route('/user/retrieve/password')
.patch((req,res,next)=> {
		const {email} = req.body;
		/// passsword will be sent to email
});










// router
// .route('/remove')
// .get((req,res,next)=> {
// 	User.remove({})
// 	.then((data)=> {
// 		return res.status(200).json({message:data});
// 	});
// })

// router
// .route('/user')
// .get((req,res,next)=> {
// 	User.find({})
// 	.then((data)=> {
// 		return res.status(200).json({message:data});
// 	});
// })





















module.exports=router;