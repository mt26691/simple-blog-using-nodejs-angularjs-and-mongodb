/**
* User Controller
*
* @module      :: Authentication Service, for log in, log out, get current user
* @description	:: manage user
*/

var model = require('../models/models')();
var User = model.User;
var AccessToken = model.AccessToken;
var crypto = require("crypto");
module.exports = {
    //query user base on certain operation
    'logIn': function (values, callback) {
        User.findOne({ email: values.email }, function (err, foundUser) {
            if (err) {
                return callback(err);
            }

            if (!foundUser) {
                return callback(null, false);
            }
            //email found, compare password
           
            foundUser.comparePassword(values.password, function (err, isMatch) {
                if (err) {
                    return callback(err);
                }
                if (!isMatch) {
                    return callback(null, false);
                }
                else {
                    var accessToken = {
                        key: crypto.randomBytes(48).toString('base64'),
                        user: foundUser.id
                    }
                    //create new access Token
                    AccessToken.create(accessToken, function (err, savedToken) {
                        foundUser.accessToken = accessToken.key;
                        return callback(null, foundUser);
                    });

                }
            });
        });
    },
    //current user with access token
    'logout': function (user, callback) {
        //delete current access token
        AccessToken.remove({ key: user.accessToken }, function (err, resData) {
            if (err) {
                return callback(err);
            }
            callback(null, true);
        });
    }

};
