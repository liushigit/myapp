var LOGIN_URL = '/login';

/**
 * Reterns a action function integrated Authentication
 * @param {function} func
 * @param {string} key
 * @return {function}
 */
 
var owner_required = function (func, key) {
	function callf(req, res, next) {

		if (res.locals[key] && req.user &&
			  res.locals[key].userId.equals(req.user._id))
		{
			console.log("ower!")
			return func(req, res, next);
		} else {
			var login_url = LOGIN_URL + '?next=' + req.originalUrl
			res.redirect(login_url);
		}
	}

	return callf
}

var login_required = function (func, next_url) {
	function callf(req, res, next) {
		if (req.user) {
			return func(req, res, next);
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
