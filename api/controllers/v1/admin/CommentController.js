/**
* Chapter Controller
*
* @module      :: Lecture admin
* @description	:: CRUD Lecture
*/

var config = require("../../../config/WebConfig");
var commentService = require("../../../services/admin/CommentService");
module.exports = {
    //list of lecture
    'query': function(req, res) {
        //current page
        var page = req.query.page == null ? 1 : req.query.page;
        //search key word
        var keyword = req.query.keyword == null ? "" : req.query.keyword;
        var isActive = req.query.isActive == null ? "" : req.query.isActive;
        var queryData = { keyword: keyword, page: page, isActive: isActive };

        commentService.query(queryData, function(err, data) {
            if (err) {
                res.status(500).json({ err: true, msg: "server error" });
            }
            else {
                //data contains data (list of comments) and number of comments
                res.status(200).json({ data: data.comments, count: data.count });
            }
        });
    },

    //comment details
    'get': function(req, res) {
        //get user id from req params
        var id = req.params.id;
        if (id != null) {
            commentService.get(id, function(err, foundComment) {
                if (err) {
                    return res.status(500).json({ err: true, msg: "server error" });
                }
                if (!foundComment) {
                    return res.status(200).json({ err: true, msg: "can not find Comment" });
                }

                return res.status(200).json(foundComment);
            });
        }
        else {
            return res.status(200).json({ err: true, msg: "Id is missing" });
        }
    },

    //create, update comment
    'post': function(req, res) {
        var postData = req.body;
        var item = {
            id: postData.id,
            content: postData.content
        };
        //create case, we do not allow to change subject in update case
        if (!item.id) {
            item.createdBy = req.user.id;
            item.article = postData.article;
        }
        //update case
        item.updatedBy = req.user.id;

        //only admin can update comment like this case
        if (req.user.role == "admin") {
            item.isActive = postData.isActive;
            item.inActiveReason = postData.inActiveReason;
        }
        else if (req.user.role != "admin") {
            //default set to true
            item.isActive = true;
        }
        if (item.isActive == null) {
            item.isActive = true;
        }

        //check required field
        if (!item.content || item.isActive == null || (item.id == null && item.article == null)) {
            return res.status(200).json({ err: true, msg: "missing some field" });
        }

        //create update lecture
        commentService.post(item, req.user, function(err, result, msg, data) {
            if (err) {
                return res.status(500).json({ err: true, msg: "Server error in admin chapter post" });
            }

            if (req.user.role != 'admin' && result) {
                //send notify email to admin
                data.sendNotifyEmail();
            }
            return res.status(200).json({ err: !result, msg: msg, data: data });
        });

    },

    //delete comment
    'delete': function(req, res) {
        var id = req.params.id;
        if (id == null) {
            return res.status(200).json({ err: true, msg: "Comment id is missing" });
        }

        commentService.delete(id, function(err, result, msg) {
            if (err) {
                return res.status(500).json({ err: true, msg: "Server error when deleting Comment" });
            }
            return res.status(200).json({ err: !result, msg: msg });
        });
    },
};

