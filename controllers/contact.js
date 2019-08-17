const express = require('express');
const router = express.Router();
const { Contact} = require('../models');
const {auth,cleanUp} = require('../middleware');



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
.get(auth,(req,res,next)=> {
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
.delete(auth,(req,res,next)=> {
	const { id }=req.params;
		Contact.findOneAndRemove({_id:id}).then((data)=> {
			res.status(200).json("deleted");
		}).catch((err)=> {
			return next(err)
		})
})

router
.route('/contact/bulk')
.post(auth,(req,res,next)=> {
	const {ids} = req.body
	if(!ids.length) {
		return res.status(404).json({message:"unable to handle delete "})
	}

	Contact.remove({'_id':{'$in':ids}})
	.then((res)=> {
		return res.status(200).json({message:res});
	}).catch((err)=> {
		return next(err);
	})
		
});

router.route('/contact/:id')
.patch(auth,(req,res,next)=> {
	const id= req.params.id
	if(!id) {
		return res.status(404).json({message:"unable to handle delete "})
	}
	Contact.update({'_id':id},{
		$set:{
			isChecked:true
		}
	})
	.then((data)=> {
		return res.status(200).json({message:data});
	}).catch((err)=> {
		return next(err);
	})

});



router.route('/contact/update/bulk')
.post(auth,(req,res,next)=> {
	const ids= req.body.ids;
	if(!ids.length) {
		return res.status(404).json({message:"unable to handle delete "})
	}
	Contact.updateMany({'_id':{'$in':ids}},{
		$set:{
			isChecked:true
		}
	})
	.then((data)=> {
		return res.status(200).json({message:data});
	}).catch((err)=> {
		return next(err);
	})

})


router.route('/contact/reply').post(auth,(req,res,next)=>{
	const {message,email}=req.body
	return res.json({message,email})

})
//END OF CONTACT

module.exports=router;