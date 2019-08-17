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
		"X-CC-Api-Key":process.env.APIKEY || "0eea37e0-ba88-48a1-a56b-ff6f71af9f15",
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
		redirect_url:"http://localhost:3000/",
		cancel_url:"http://localhost:3000/"

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