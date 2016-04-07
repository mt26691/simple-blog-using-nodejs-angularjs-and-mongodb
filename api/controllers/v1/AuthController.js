/**
* User Controller
*
* @module      :: Auth Controller
* @description	:: User Controller for login, logout, get current login user
*/

var authService = require("../../services/AuthService");
var jwtService = require("../../services/JWTService");
var crypto = require('crypto');
module.exports = {
    'me': function(req, res) {
        if (req.user == null) {
            return res.status(200).json({});
        }
        return res.status(200).json({ name: req.user.name, email: req.user.email, role: req.user.role });
    },

    'login': function(req, res) {
        var data = { email: req.body.email, password: req.body.password, isRemember: req.body.isRemember };
        authService.logIn(data, function(err, user) {
            if (err) {
                return res.status(200).json({ err: true, msg: "server error" });
            }
            if (!user) {
                return res.status(200).json({ err: true, msg: "Wrong username or password" });
            }
            else {
                //1 hour
                var expiresTime = 60 * 60 * 1000;
                if (data.isRemember) {
                    //14 days 14h 60 min 60s 1000 milisecond    
                    expiresTime = 14 * 24 * 60 * 60 * 1000;
                }
                //save with new access token
                var clientToken = jwtService.issueToken(user.accessToken);
                var returnUser = { name: user.name, role: user.role, email: user.email, isRemember: data.isRemember, id: user.id, accessRight: 1 };
                if (returnUser.role == "admin") {
                    returnUser.accessRight = 9;
                }

                var returnedData = { token: clientToken };

                //issue new cookie
                res.cookie("AuthSession", returnedData, { expires: new Date(Date.now() + expiresTime), httpOnly: true });

                res.status(200).json({ user: returnUser, expires: expiresTime });
            }
        });
    },
    //let user logout
    'logout': function(req, res) {
        if (req.user) {
            //delete current access token
            authService.logout(req.user, function(err, result) {
            });
        }
        res.clearCookie('AuthSession');
        res.clearCookie('AuthUser');
        res.redirect('/');
    }
};
