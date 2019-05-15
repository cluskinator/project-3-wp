var authController = require('../controllers/authcontroller.js');
 
 
module.exports = function(app, passport) {
 
    app.get('/signup', authController.signup);
 
 
    app.get('/signin', authController.signin);

    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/quickstart',
 
        failureRedirect: '/signin'
    }
 
        ));
 
    app.get('/quickstart',isLoggedIn, authController.quickstart);

    app.get('/logout',authController.logout);

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/quickstart',
 
            failureRedirect: '/signup'
        }
 
    ));
 
    function isLoggedIn(req, res, next) {
 
        if (req.isAuthenticated())
         
            return next();
             
        res.redirect('/signin');
     
    } 
}