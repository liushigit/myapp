var LOGIN_URL = '/login';

var login_required = function (func) {
	function callf(req, res) {
		if (req.user) {
			return func(req, res);
		} else {
			res.redirect(LOGIN_URL);
		}
	} 

	return callf
}

module.exports = {
	'login_required': login_required
}