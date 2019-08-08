const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const controllers = require('./controllers');
const cors = require('cors');
app.use(cors());

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/palitodb',{
	useNewUrlParser:true,
}).then(()=> {
	console.log('connected');
}).catch((err)=> {
	// console.log(err);
});
app.use('/uploads',express.static('uploads'))
app.get('/',((req,res,next)=>{

	return res.status(200).json({message:'welcome home'});

}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(controllers);
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


