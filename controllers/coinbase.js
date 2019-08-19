const express = require('express');
const fetch = require('node-fetch');
const { Stocks} = require('../models');
const router = express.Router();
const {headersObj,coinbaseUrl} = require('../middleware');


// COINBASE API REQUEST TO CREATE CHARGE AND CONCEL CHARGE GOES BELOW THIS ROUTINGS

router.route('/charges').post(async(req,res,next)=> {
	const {title,description,clientAmount,email } = req.body;
	if(! title || !description || !clientAmount || !email) {
		return next({message:'invalid inputs'});
	}

try {

const result =await fetch(`${coinbaseUrl}/charges`,headersObj(title,description,clientAmount,email));
const jsonData = result.json();
const val = await jsonData;
if(val) {
	return res.status(200).json(val.data);
}

}catch(err){
return res.status(500).json({message:'network error'})

}

	
})

router.route('/charges/:id/cancel').post((req,res,next)=> {
const { id }=req.params;
return fetch(`${coinbaseUrl}/charges/${id}/cancel`,{
		method:'post'
	})
	.then(res=>res.json())
	.then(result=>res.status(200).json({message:'charge canceled!!!'}))
	.catch(err=>res.status(500).json({message:'opppss network error!!!'}));
})


router.route('/coinbase/cancel').post((req,res,next)=> {
	console.log(req.body);

})

router.route('/event').post((req,res,next)=> {
	console.log(req.body);

})




//END OF COINBASE API CALLS




//HANDLING COINBASE PAYMENT GOES DOWN BELOW HERE

router
.route('/stocks/payment')
.post((req,res,next)=> {
	const { id } = req.params;
	//reqest to payment api goes here
	const numberOfStock=2;
	const newStocks =Stocks.findOne({_id:id}).then((data)=> {
		const  extract = data.licensekey.splice(0,numberOfStock);
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