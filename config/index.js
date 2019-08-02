const coinbaseStrategy =require('passport-coinbase').Strategy;


module.exports=function(passport) {
		passport.use(new coinbaseStrategy({
			clientID:"a01d011b34c76d24ca5b9dc1b0597486a7514ad530f537a31277e5dab5aced91",
			clientSecret:"f966319cbbc7c9463a4988b58114acfaa0f5b0d57ca5eae2f93636f699aacf69",
		    callbackURL: "http://localhost:3001/auth/coinbase/callback"

		},function(accessToken, refreshToken, profile, done) {
   			
  		
  	}))
}



