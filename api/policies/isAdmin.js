/**
* is verified
* @module      :: Is verified user, check whether this user is verified
*/

var model = require('../models/models');
var jwtService = require('../services/JWTService');
module.exports = function(req, res, next) {
    //if current user is admin
    if (req.user && req.user.role == "admin") {
        next();
    } else {
        return res.status(401).json({ err: true, msg: "You don't have the right to access this page" });
    }
};
