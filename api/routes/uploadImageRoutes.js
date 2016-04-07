var express = require('express');
var router = express.Router();
var uploadImageController = require("../controllers/v1/admin/UploadImageController");
var checkIn = require("../policies/checkin");
var isAdmin = require("../policies/isAdmin");
var isAdmin = require("../policies/isAdmin");

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

var upload = multer({ storage: storage }).single('userPhoto');

var lectureUpload = multer({ storage: storage }).single('upload');


router.post('/uploadArticleImage', [checkIn, isAdmin, upload, uploadImageController.uploadArticleImage]);

router.post('/uploadImage', [checkIn, isAdmin, lectureUpload, uploadImageController.uploadImage]);
module.exports = router;
