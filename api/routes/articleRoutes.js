var express = require('express');
var router = express.Router();
var articleController = require("../controllers/v1/admin/ArticleController");
var checkIn = require("../policies/checkin");
var isAdmin = require("../policies/isAdmin");

router.get('/', [checkIn, isAdmin, articleController.query]);
router.get('/:id', [checkIn, isAdmin, articleController.get]);
router.post('/', [checkIn, isAdmin, articleController.post]);
router.delete('/:id', [checkIn , isAdmin, articleController.delete]);

module.exports = router;
