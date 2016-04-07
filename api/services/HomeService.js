/**
* User Controller
*
* @module      :: Authentication Service, for log in, log out, get current user
* @description	:: manage user
*/

var model = require('../models/models')();
var Article = model.Article;
var config = require("../config/WebConfig");
var User = model.User;
module.exports = {

    'home': function (callback) {
        Article
        //find only active subjects
            .find({ isActive: true })
            .select({
                chapters: 0,
                createdAt: 0,
                updatedAt: 0,
                updatedBy: 0,
                __v: 0,
                isActive: 0,
                inActiveReason: 0,
                description: 0
            })
            .sort({ createdAt: 'desc' })
            .populate('createdBy', 'name')
            .exec(function (err, subjects) {
                if (err) {
                    return callback(err);
                }

                callback(null, subjects);
            });
    },

    'articleDetails': function (subjectNameUrl, user, callback) {
        Subject
        //find only active subjects
            .findOne({ nameUrl: subjectNameUrl })
            .select({
                updatedAt: 0,
                updatedBy: 0,
                __v: 0,
            })
            .populate('createdBy', 'name')
            .populate('chapters', 'name nameUrl description', { isActive: true }, { sort: { 'order': 1 } })
            .populate('level', 'name')
            .exec(function (err, subject) {
                if (err) {
                    return callback(err);
                }
                if (!subject) {
                    return callback(null, false, "can not find subject")
                }
                if (subject.isActive == false) {
                    return callback(null, false, subject.inActiveReason)
                }
                Chapter
                    .find({ subject: subject.id, isActive: true })
                    .select({ name: 1, nameUrl: 1, description: 1 })
                    .sort({ order: 'asc' })
                    .exec(function (err, chapters) {
                        if (err) {
                            return callback(err);
                        }

                        if (user != null) {
                            User
                                .findOne({ _id: user.id })
                                .select({ attendedSubjects: 1 })
                                .exec(function (err, foundUser) {
                                    if (err || !foundUser) {
                                        return callback(null, true, "", { subject: subject, chapters: chapters, attendedResult: null });
                                    }

                                    var attendedResult = { isAttended: true, msg: "Tiếp tục học" };
                                    
                                    //if user is attend to that subject
                                    if (foundUser.attendedSubjects.indexOf(subject.id) >= 0) {
                                        return callback(null, true, "", { subject: subject, chapters: chapters, attendedResult: attendedResult });
                                    }
                                    //if user not attend to that subject
                                    else {
                                        attendedResult = { isAttended: false, msg: "Tham gia" };

                                        return callback(null, true, "", { subject: subject, chapters: chapters, attendedResult: attendedResult });
                                    }

                                });
                        }
                        else {
                            callback(null, true, "", { subject: subject, chapters: chapters, attendedResult: null });
                        }

                    });
            });
    },
    articleByID: function (id, callback) {

        Lecture
            .findOne({ _id: id })
            .select({
                nameUrl: 1,
                subject: 1,
                chapter: 1
            })
            .populate('subject', 'nameUrl')
            .populate('chapter', 'nameUrl')
            .exec(function (err, foundLecture) {

                if (err || !foundLecture) {
                    return callback(err, false);
                }
                else {
                    var redirectUrl = "/" + foundLecture.subject.nameUrl + "/" + foundLecture.chapter.nameUrl + "/" + foundLecture.nameUrl;
                    return callback(null, true, redirectUrl)
                }

            });
    },
};
