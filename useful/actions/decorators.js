var LOGIN_URL = '/login';

var owner_required = function (func, key) {
	function callf(req, res) {
		if (res.locals.key && res.locals[key].userId === req.user._id) {
			return func(req, res);
		} else {
			res.redirect(LOGIN_URL);
		}
	}
}

var login_required = function (func, next_url) {
	function callf(req, res) {
		if (req.user) {
			return func(req, res);
		} else {
			var login_url = next_url ? LOGIN_URL + '?next=' + next_url : LOGIN_URL
			res.redirect(login_url);
		}
	} 

	return callf
}

module.exports = {
	'login_required': login_required,
	'owner_required': owner_required
}