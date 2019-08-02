const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

 const hash =(password)=> {
 	return bcrypt.hashSync(password,10);
 }

 const compare = (password,hash) => {
 	return bcrypt.compareSync(password,hash);
 }

function auth (req,res,next){
 	try{
 		const token_val= req.headers.authorization.split(' ')[1];
 		jwt.verify(token_val,"my secret");
		return next()
 	}catch(err){
 		return res.status(404).json({err:err});
 	}
 }
 

 module.exports={
 	hash,
 	compare,
 	auth

 };