/*
 * 認証チェック
 */
exports.auth = function isAuthenticated(req, res, next){    
	if (req.isAuthenticated()) {
        // 認証済
        var username = req.user._json.preferred_username
        console.log("認証済 User:"+username);
		return next();
    }else {
        // 認証されていない
        console.log("認証されていない");
        res.redirect('/login');
    }
};
