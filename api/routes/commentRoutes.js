var express = require('express');
var router = express.Router();
var commentController = require("../controllers/v1/admin/CommentController");
var checkIn = require("../policies/checkin");
var isAuthenticated = require("../policies/isAuthenticated");
var isAdmin = require("../policies/isAdmin");

router.get('/', [checkIn, isAdmin, commentController.query]);
router.get('/:id', [checkIn, isAdmin, commentController.get]);
router.post('/', [checkIn, isAuthenticated, commentController.post]);
router.delete('/:id', [checkIn, isAdmin, commentController.delete]);

module.exports = router;
