var Users = require('../models/users').Users;

exports.index = function(req, res){
	res.render('reg');
}

exports.send = function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	Users.authorize(username, password, function(err, user) {
		if (err) {
			console.log('Error reg js');
		} else {
			console.log(user._id);
		}
		req.session.user = user._id;
		res.send({});
		res.redirect('/');
	});
	
	
	
		// var user = new Users({
		// username: username,
		// password: password
	// });
	
	// user.save(function(err, user, affected){
		// 
	// });	
	

}

exports.logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
}