/**
* User Controller
*
* @module      :: Authentication Service, for log in, log out, get current user
* @description	:: manage user
*/

var model = require('../models/models')();
var User = model.User;
var tokenService = require("./TokenService");
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var AccessToken = model.AccessToken;
var Subject = model.Subject;
module.exports = {

    //register new account base on name, username and password
    'register': function(registerData, callback) {
        //check duplicate email
        User.findOne({ email: registerData.email }, function(err, foundUser) {

            if (err) {
                return callback(err);
            }
            if (foundUser) {
                return callback(err, false, "Duplicate email");
            }
            //create new user base on username, password, email address
            User.create(registerData, function(err, user) {
                if (err) {
                    return callback(err);
                }
                callback(null, true, "User registerd", user);
            })
        });
    },
    //change password, input data is current user id and password
    changePassword: function(changePasswordData, callback) {
        User.findOne({ _id: changePasswordData.id }, function(err, foundUser) {
            if (err) {
                return callback(err);
            }
            if (!foundUser) {
                return callback(null, false, "User not found");
            }
            console.log("XXXXXX");
            console.log(changePasswordData.currentPassword);
            if (foundUser.comparePassword(changePasswordData.currentPassword, function(err, result) {
                if (err) {
                    return callback(err);
                }
                if (!result) {
                    return callback(null, false, "The current password is wrong.");
                }
                foundUser.password = changePasswordData.password;
                foundUser.save();
                //remove all access token belong to user
                AccessToken.remove({ user: foundUser.id }, function(err, result) {
                    //add new access token
                    var accessToken = {
                        key: crypto.randomBytes(48).toString('base64'),
                        user: foundUser.id,
                    }
                    AccessToken.create(accessToken, function(err) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, true, "", accessToken.key);
                    });
                });

            }));
        });
    },
    resetPassword: function(changePasswordData, callback) {

        User.findOne({ "passwordResetToken.value": changePasswordData.passwordResetToken }, function(err, foundUser) {
            if (err) {
                return callback(err);
            }
            if (!foundUser) {
                return callback(new Error("User is not found"));
            }
            // Check if token is expired
            var expires = new Date().setHours(new Date().getHours() - 48);

            var isssueAt = new Date(foundUser.passwordResetToken.issuedAt);

            if (isssueAt.getTime() <= expires) {
                return callback(new Error("Token expried"));
            }
            foundUser.password = changePasswordData.password;
            foundUser.passwordResetToken = null;
            foundUser.save(function(err, savedUser) {
                if (err) return callback(err);
                //remove all access token belong to a user
                AccessToken.remove({ user: foundUser.id });
                callback(null, foundUser);
            });

        });
    },
    getProfile: function(userId, callBack) {
        User
            .findOne({ _id: userId })
            .select({ name: 1, email: 1 })
            .exec(function(err, foundUser) {
                if (err) {
                    return callBack(err);
                }
                if (!foundUser) {
                    return callBack(null, foundUser, null);
                }
                Subject
                    .find({ createdBy: userId })
                    .select({ name: 1, nameUrl: 1 })
                    .exec(function(err, subjects) {
                        return callBack(null, foundUser, subjects);
                    });
            });
    },
};
