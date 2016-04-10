/**
* User Controller
*
* @module      :: Account Controller
* @description	:: register new user, verify user, send password reset email.
*/

var model = require('../../models/models')();
var User = model.User;
var accountService = require("../../services/AccountService");
var emailService = require("../../services/EmailService");
var jwtService = require("../../services/JWTService");

module.exports = {
    //Register new user with name, email and password
    'register': function(req, res) {
        var registerData = { email: req.body.email, name: req.body.name, password: req.body.password };
        //register new user
        accountService.register(registerData, function(err, result, msg, newUser) {
            if (err) {
                return res.status(200).json({ err: true, msg: "server error" });
            }
            if (!result) {
                return res.status(200).json({ err: true, msg: msg });
            }
            return res.status(200).json({ email: newUser.email, isSuccess: true });
        });
    },

    //logged in users can change their password
    changePassword: function(req, res) {
        if (!req.user) {
            return res.status(401).json("not authenticated user");
        }
        var changePasswordData = { currentPassword: req.body.currentPassword, password: req.body.password, id: req.user.id };

        accountService.changePassword(changePasswordData, function(err, result, msg, newToken) {

            if (err) {
                return res.json({ err: true, msg: "unexpected error while changing password" });
            }

            if (result === false) {
                return res.json({ err: true, msg: msg });
            }

            var returnedData = { token: jwtService.issueToken(newToken) };

            //1 hour
            var expiresTime = 60 * 60 * 1000;

            if (req.cookies.AuthUser.isRemember) {
                //14 days 14h 60 min 60s 1000 milisecond    
                expiresTime = 14 * 24 * 60 * 60 * 1000;
            }

            //issue new cookie
            res.cookie("AuthSession", returnedData, { expires: new Date(Date.now() + expiresTime), httpOnly: true });

            //return
            res.json({ err: false, msg: "Thay đổi mật khẩu thành công." });


        });
    },
    //logged in users can change their profile
    changeProfile: function(req, res) {
        var data = {};
        data.name = req.body.name;
        data.id = req.user.id;

        if (data.name == null) {
            return res.json({ err: true, msg: "Thiếu tên" });
        }

        accountService.changeProfile(data, function(err, result, msg, savedUser) {
            if (err || !result) {
                return res.json({ err: true, msg: msg });
            }
            else {
                //1 hour
                var expiresTime = 60 * 60 * 1000;

                if (req.cookies.AuthUser.isRemember) {
                    //14 days 14h 60 min 60s 1000 milisecond    
                    expiresTime = 14 * 24 * 60 * 60 * 1000;
                }

                var returnUser = { name: savedUser.name, role: savedUser.role, email: savedUser.email, isRemember: req.cookies.AuthUser.isRemember, id: req.user.id };
                return res.json({ err: false, msg: msg, user: returnUser, expires: expiresTime });
            }
        });
    },

    /**
    * Create a new password reset token and send 
    * an email with instructions to user
    */
    sendPasswordResetEmail: function(req, res) {
        var email = req.body.email;
        if (!email) {
            return res.status(200).json({ err: true, msg: "Email not found." });
        }

        User.findOne({ email: email }, function(err, user) {
            if (err) return res.serverError(err);

            if (!user) {
                return res.json({ err: true, msg: "Email not found" });
            }

            //for testing purpose
            user.sendPasswordResetEmail(function() {
                return res.json({ email: user.email });
            });

        });
    },

    /**
     * POST request, which contains user id and reset token
     * @param  {any} req, POST request
     * @param  {any} res, return json
     */
    getResetPasswordData: function(req, res) {

        var passwordResetToken = req.body.passwordResetToken;

        if (!passwordResetToken || passwordResetToken.length < 32 || passwordResetToken.length > 40) {
            return res.json({ err: true, msg: "Token is missing" });
        }

        //find user by id
        User.findOne({ "passwordResetToken.value": passwordResetToken }, function(err, user) {
            if (err) return res.status(500);
            //if user can not be found
            if (!user) {
                return res.json({ err: true, msg: "Link is wrong." });
            }
            //if token is invalid
            var expires = new Date().setHours(new Date().getHours() - 48);
            var isssueAt = new Date(user.passwordResetToken.issuedAt);

            if (isssueAt.getTime() <= expires) {
                return res.status(200).json({ err: true, msg: "Link is expired." });
            }

            return res.status(200).json({ name: user.name, email: user.email });
        });
    },

    /**
    * Update user password 
    * Expects and consumes a password reset token
    */

    resetPassword: function(req, res) {

        var resetPasswordData = { password: req.body.password, passwordResetToken: req.body.passwordResetToken };
        if (!resetPasswordData.passwordResetToken || !resetPasswordData.password) {
            return res.status(200).json({ err: true, msg: "Unexpected token" });
        }
        accountService.resetPassword(resetPasswordData, function(err, savedUser) {
            if (err) {
                return res.status(200).json({ err: true, msg: "Server error." });
            }
            //reset password and let user login
            else {
                req.user = savedUser;
                return res.json({ email: savedUser.email });
            }
        });
    },
    getProfile: function(req, res) {
        var userId = req.body.userId;
        accountService.getProfile(userId, function(err, foundUser, subjects) {
            if (err) {
                res.status(200).json({ err: true, msg: "Exp" });
            }
            else {
                res.status(200).json({ err: false, user: foundUser, subjects: subjects });
            }
        })
    }
};
