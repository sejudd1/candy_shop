// Here is where we set our User model
var mongoose = require( "mongoose") ;



module.exports = mongoose.model("User", {
	//facebook doc
	fb: {
		id: String,
		access_token: String,
		firstName: String,
		lastName: String,
		email: String
	}
});
