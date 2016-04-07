/**
* is verified
* @module      :: Is verified user, check whether this user is verified
*/

var model = require('../models/models');
var jwtService = require('../services/JWTService');
module.exports = function (req, res, next) {
    if (req.user && req.user.isActive) {
        next();
    } else {
        res.clearCookie('AuthSession');
        res.clearCookie('AuthUser');
        
        return res.redirect('/dang-nhap');
    }

};
