//Here is where our passport module goes
var User = require("../models/User")
	FacebookStrategy = require( "passport-facebook" ).Strategy


module.exports = function ( passport ) {
	//Get the user id to store for session
	passport.serializeUser( function ( user, done ) {
		done( null, user._id )
	})
	//grab user every time we want the whole object in passport
    passport.deserializeUser( function( id, done ) {
        User.findById( id, function (err, user ) {
            done(err, user);
        })
    })

    passport.use( "facebook", new FacebookStrategy({
        clientID        : process.env.
        clientSecret    : process.env.
        callbackURL     : "http://localhost:3000/auth/facebook/callback",
        enableProof     : true,
        profileFields   : [ "name", "email" ]
    }, function( access_token, refresh_token, profile, done ) {

    // Use this to see the information returned from Facebook
    // console.log(profile)

        process.nextTick(function() {

            User.findOne({ "fb.id" : profile.id }, function(err, user) {
                if (err) {
                    return done(err);
                } else if ( user ) {
                  return done( null, user );
                } else {

                    var newUser = new User();
                    newUser.fb.id           = profile.id;
                    newUser.fb.access_token = access_token;
                    newUser.fb.firstName    = profile.name.givenName;
                    newUser.fb.lastName     = profile.name.familyName;
                    newUser.fb.email        = profile.emails[0].value;

                    newUser.save(function( err ) {
                        if ( err ) {
                                throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
}