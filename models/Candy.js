var
	mongoose = require( "mongoose" ),
	CandySchema = mongoose.Schema({
		name: String,
		color: String
	});

module.exports = mongoose.model( "Candy", CandySchema );
	
	