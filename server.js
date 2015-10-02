var express        = require( "express" ),
    path           = require( "path" ),
    logger         = require( "morgan" ),
    bodyParser     = require( "body-parser" ),
    app            = express(),
    mongoose       = require( "mongoose" ),
    routes         = require( "./config/routes" ),
    passport       = require( "passport" ),
    expressSession = require( "express-session" ),
    cookieParser   = require( "cookie-parser" )



mongoose.connect( "mongodb://localhost:27017/candies-app" );

app.use(expressSession({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true 
})
)

app.use(passport.initialize());
app.use(passport.session());


app.use( logger( "dev" ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );

app.set( "views", path.join( __dirname, "views" ) );
app.engine( "ejs", require( "ejs" ).renderFile );
app.set( "view engine", "ejs" );

// Add static middleware
app.use( express.static( __dirname + "/public" ) );

// Setting up the Passport Strategies
require( "./config/passport" )( passport );


//Render main layout view
app.get("/", function ( req, res ){
  res.render( "layout.ejs", { user: req.user } )

})

//create facebook request
app.get("/auth/facebook", passport.authenticate( "facebook", { scope: "email" } ) )

//Route handler for facebook callback strategy
app.get("/auth/facebook/callback", 
  //tell passport what to do on success and failure
  passport.authenticate( "facebook", {
    succesRedirect: "/",
    failureRedirect: "/"
  })
)

app.get( "/logout", function ( req, res ) {
  req.logout()
  res.redirect("/")

})

app.use( routes );

app.listen( 3000 );
