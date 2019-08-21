const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const controllers = require('./controllers');
const feedback = require('./controllers/feedback');
const contact = require('./controllers/contact');
const stock = require('./controllers/stock');
const coinbase = require('./controllers/coinbase');
const upload = require('./controllers/upload');
const cors = require('cors');
app.use(cors());

// const mongoose = require('mongoose');
// var mongodbUri ='mongodb://@ds249992.mlab.com:49992/databasename';
// mongoose.connect(mongodbUri, {
//   useNewUrlParser: true,
//   auth: {
//     user: 'UserName',
//     password: 'Password'
//   }
// })
// var conn = mongoose.connection;    
// conn.on('error', console.error.bind(console, 'connection error:'));  
 
// conn.once('open', () =>{
//  console.log('connected to adatabase')                       
// });

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/palitodb',{
	useNewUrlParser:true,
}).then(()=> {
	console.log('connected');
}).catch((err)=> {
	// console.log(err);
});
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',((req,res,next)=>{
	return res.status(200).json({message:'welcome home!!!'});
	}));

app.use(controllers);
app.use(feedback);
app.use(contact);
app.use(stock);
app.use(upload);
app.use(coinbase);

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


