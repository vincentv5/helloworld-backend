const express = require('express');
const router = express.Router();
const { Stocks} = require('../models');
const {auth,cleanUp} = require('../middleware');



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
.delete(auth,(req,res,next)=> {
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

module.exports=router;