/*
 * 認証チェック
 */

exports.auth = function isAuthenticated(req, res, next){
    console.log('auth URL:'+ req.originalUrl);
    console.log('req.isAuthenticated:'+req.isAuthenticated());
    
	if (req.isAuthenticated()) {
        // 認証済
        console.log("認証済 User:"+req.user.username);
		return next();
    }else {
        // 認証されていない
        console.log("認証されていない");
        res.redirect('/login');
    }
};