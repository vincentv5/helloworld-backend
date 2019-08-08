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
 
 const cleanUp =(data)=>{
		return data.trim();
 }



const coinbaseUrl ='https://api.commerce.coinbase.com';
const headersObj=(title,description,price,email)=> {
	return {
		method: "post",
		headers: {
		"Content-type":"application/json",
		"X-CC-Api-Key":process.env.APIKEY || "79fe0d1a-42e6-4f79-8474-202d22001e88",
		"X-CC-Version":"2018-03-22"
		},
		body:JSON.stringify({
		name:`${title}`,
		description:`${description}`,
		pricing_type:'fixed_price',
		local_price:{
			amount:`${price}`,
			currency:"USD"
		},
		metadata:{
			costumer_name:`${email}`
		},
		redirect_url:"",
		cancel_url:"http://localhost:3001/coinbase/cancel"

		})
		}

}







const SECRET = "my secret";
 module.exports={
 	hash,
 	compare,
 	auth,
 	SECRET,
 	cleanUp,
 	headersObj,
 	coinbaseUrl


 };