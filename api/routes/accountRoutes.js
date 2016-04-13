var express = require('express');
var router = express.Router();
var accountController = require("../controllers/v1/AccountController");
var checkIn = require("../policies/checkin");
var isAuthenticated = require("../policies/isAuthenticated");


router.post('/register', accountController.register);

router.get('/getProfile', accountController.getProfile);

router.post('/sendPasswordResetEmail', accountController.sendPasswordResetEmail);

router.post('/getResetPasswordData', accountController.getResetPasswordData);

router.post('/resetPassword', accountController.resetPassword);

router.post('/changePassword', [checkIn, isAuthenticated, accountController.changePassword]);

router.post('/changeProfile', [checkIn, isAuthenticated, accountController.changeProfile]);

router.get('/me', [checkIn, accountController.me]);

module.exports = router;
