var LOGIN_URL = '/login';

var owner_required = function (func, key) {
	function callf(req, res) {

		console.log(key)
		if (res.locals[key] && req.user && res.locals[key].userId.equals(req.user._id)) {
			console.log("ower!")
			return func(req, res);
		} else {
			var login_url = LOGIN_URL + '?next=' + req.originalUrl
			res.redirect(login_url);
		}
	}
	
	return callf
}

var login_required = function (func, next_url) {
	function callf(req, res) {
		if (req.user) {
			return func(req, res);
		} else {
			// var login_url = next_url ? LOGIN_URL + '?next=' + next_url : LOGIN_URL
			var login_url = LOGIN_URL + '?next=' + req.originalUrl
			res.redirect(login_url);
		}
	} 

	return callf
}

module.exports = {
	'login_required': login_required,
	'owner_required': owner_required
}