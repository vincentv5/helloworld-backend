const express = require('express');
const router = express.Router();
const {Feedback} = require('../models');
const {auth,cleanUp} = require('../middleware');

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
.delete(auth,(req,res,next)=> {
	const { id }=req.params;
		Feedback.findOneAndRemove({_id:id}).then((data)=> {
			res.status(200).json("deleted");
		}).catch((err)=> {
			return next(err)
		})
})



router
.route('/feedback/bulk')
.post(auth,(req,res,next)=> {
	const ids= req.body.ids;
	if(!ids.length) {
		return res.status(404).json({message:"unable to handle delete "})
	}
	Feedback.remove({'_id':{'$in':ids}})
	.then((data)=> {
		return res.status(200).json({message:data});
	}).catch((err)=> {
		return next(err);
	})
	



});

router.route("/feedback/update/bulk")
.post(auth,(req,res,next)=> {
	const ids= req.body.ids;
	if(!ids.length) {
		return res.status(404).json({message:"unable to handle delete "})
	}
	Feedback.updateMany({'_id':{'$in':ids}},{
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

router.route('/feedback/:id')
.patch(auth,(req,res,next)=> {
	const id= req.params.id
	if(!id) {
		return res.status(404).json({message:"unable to handle delete "})
	}
	Feedback.update({'_id':id},{
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





router.route('/feedback/reply').post(auth,(req,res,next)=>{
	const {message,email}=req.body
	if(!message || !email) {
		return res.status(404).json({message:'cannot handle this'})
	}
	return res.json({message,email});

})

//END OF FEED BACK

module.exports=router;