var exports = module.exports = {}
 
exports.signup = function(req, res) {
 
    res.render('signup');
 
}

exports.signin = function(req, res) {
 
    res.render('signin');
 
}
exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('/');
 
    });
 
}
exports.quickstart = function(req, res) {
 
    res.render('quickstart');
 
}

exports.dashboard = function(req, res) {
 
    res.render('dashboard');
 
}

exports.form = function(req, res) {
    
    res.render('form');

}