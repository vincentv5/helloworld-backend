const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const controllers = require('./controllers');
const cors = require('cors');
const axios = require('axios');
const coinbase= require('coinbase');

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/palitodb',{
	useNewUrlParser:true,
}).then(()=> {
	console.log('connected');
}).catch((err)=> {
	console.log(err);
});
app.use('/uploads',express.static('uploads'))
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(controllers);







// function apis() {
// const  client   = new coinbase.Client({
// 	'apiKey':'a00whwlVv0aiMxOQ',
// 	'apiSecret':'mXkoqKDyemQpib83awADx1YuthCJdRM4 '
// 	});

// 	client.getAccounts({}, (err, accounts) => {
//  	if(err) {
//  		console.log(err);
//  	}else {
//  	 accounts.forEach(account => {
//       console.log(`${account.name}: ${account.balance.amount} ${account.balance.currency}`);
//       // My Wallet: 12.03 BTC
//   });
//  	}
// });

// }

// apis();



app.use((req,res,next)=>{
	const err= new Error('NOT FOUND !');
	err.status=401;
	return next(err);
});

app.use((err,req,res,next)=> {
	const status = (err.status || 500);
	return res.json({message:err.message,status:status});
});



module.exports=app;


