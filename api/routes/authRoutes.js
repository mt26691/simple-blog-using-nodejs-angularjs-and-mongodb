var express = require('express');
var router = express.Router();
var authController = require("../controllers/v1/AuthController");
var checkIn = require("../policies/checkin");

router.post('/login/local', authController.login);
router.get('/me', [checkIn, authController.me]);
router.get('/logout', [checkIn, authController.logout]);

module.exports = router;
