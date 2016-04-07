var express = require('express');
var router = express.Router();
var homeController = require("../controllers/v1/HomeController");
var checkIn = require("../policies/checkin");
var isAuthenticated = require("../policies/isAuthenticated");

router.get("/", homeController.home);
router.get("/search", homeController.search);
router.get('/:subjectNameUrl', [checkIn, homeController.subjectDetails]);

router.get('/:subjectNameUrl/:chapterNameUrl/:lectureNameUrl?', homeController.lectureDetails);

module.exports = router;
