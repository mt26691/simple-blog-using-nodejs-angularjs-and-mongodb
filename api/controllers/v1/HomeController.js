/**
* Home Controller
* @module      :: Home Controller
*/

var homeService = require("../../services/HomeService");
module.exports = {
    //Register new user with name, email and password
    'home': function(req, res) {
        homeService.home(function(err, subjects) {
            if (err) {
                return res.status(500);
            }

            return res.status(200).json({ err: false, subjects: subjects });
        });
    },
    'articleDetails': function(req, res) {
        var subjectNameUrl = req.params.subjectNameUrl.toLowerCase();
        var chapterNameUrl = req.params.chapterNameUrl.toLowerCase();
        var lectureNameUrl = req.params.lectureNameUrl;
        if (lectureNameUrl != null) {
            lectureNameUrl = lectureNameUrl.toLowerCase();
        }

        homeService.articleDetails(subjectNameUrl, chapterNameUrl, lectureNameUrl, function(err, result, msg, data) {
            if (err) {
                return res.status(500);
            }

            if (result == false) {
                return res.status(200).json({ err: true, msg: msg })
            }
            return res.status(200).json(
                {
                    err: false,
                    subject: data.subject,
                    selectedChapter: data.selectedChapter,
                    lectures: data.lectures,
                    selectedLecture: data.selectedLecture,
                    comments: data.comments
                });
        });
    },
    'lectureOnId': function(req, res) {
        var id = req.params.id;
        if (id == null) {
            return res.redirect("/");
        }
        homeService.lectureOnId(id, function callback(err, result, redirectUrl) {
            if (err || !result) {
                return res.redirect("/");
            }

            return res.redirect(redirectUrl);
        });
    },
};
