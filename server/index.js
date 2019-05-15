'use strict';

/**
 * Load Twilio configuration from .env config file - the following environment
 * variables should be set:
 * process.env.TWILIO_ACCOUNT_SID
 * process.env.TWILIO_API_KEY
 * process.env.TWILIO_API_SECRET
 */
require('dotenv').load();

var http = require('http');
var path = require('path');
var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
var express = require('express');
var randomName = require('./randomname');
var passport   = require('passport')
var session    = require('express-session')
var bodyParser = require('body-parser')
var env        = require('dotenv').config()
var exphbs     = require('express-handlebars')

// Create Express webapp.
var app = express();

// Set up the paths for the examples.
[
  'bandwidthconstraints',
  'codecpreferences',
  'localvideofilter',
  'localvideosnapshot',
  'mediadevices'
].forEach(function(example) {
  var examplePath = path.join(__dirname, `../examples/${example}/public`);
  app.use(`/${example}`, express.static(examplePath));
});

// Set up the path for the quickstart.
var quickstartPath = path.join(__dirname, '../quickstart/public');
app.use('/quickstart', express.static(quickstartPath));

// Set up the path for the examples page.
var examplesPath = path.join(__dirname, '../examples');
app.use('/examples', express.static(examplesPath));

// Set up the path for the signup page
var signupPath = path.join(__dirname, '../views');
app.use('/views', express.static(signupPath));

/**
 * Default to the signup page.
 */
app.get('/', function(request, response) {
  response.redirect('/signup');
});

// signup logic
var authController = require('../controllers/authcontroller.js');
 
 
module.exports = function(app, passport) {
 
    app.get('/signup', authController.signup);
 
    app.get('/dashboard', authController.dashboard);

    app.get('/signin', authController.signin);

    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/quickstart',
 
        failureRedirect: '/signin'
    }
 
        ));
 
    app.get('/quickstart',isLoggedIn, authController.quickstart);

    app.get('/logout',authController.logout);

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/dashboard',
 
            failureRedirect: '/signup'
        }
 
    ));
 
    function isLoggedIn(req, res, next) {
 
        if (req.isAuthenticated())
         
            return next();
             
        res.redirect('/signin');
     
    }
 
}
//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


 // For Passport
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


 //For Handlebars
app.set('views', './views')
app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');


app.get('/', function(req, res){
  res.send('welcome to worldphone');
});


//Models
var models = require("../models");


//Routes
var authRoute = require('../routes/auth.js')(app,passport);


//load passport strategies
require('../config/passport/passport.js')(passport,models.user);


//Sync Database
   models.sequelize.sync().then(function(){
console.log('Sequelize worked')

}).catch(function(err){
console.log(err,"DB Issue")
});


/**
 * Generate an Access Token for a chat application user - it generates a random
 * username for the client requesting a token, and takes a device ID as a query
 * parameter.
 */
app.get('/token', function(request, response) {
  var identity = randomName();

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );

  // Assign the generated identity to the token.
  token.identity = identity;

  // Grant the access token Twilio Video capabilities.
  var grant = new VideoGrant();
  token.addGrant(grant);

  // Serialize the token to a JWT string and include it in a JSON response.
  response.send({
    identity: identity,
    token: token.toJwt()
  });
});

// Create http server and run it.
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Express server running on *:' + port);
});
