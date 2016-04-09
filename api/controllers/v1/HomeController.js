/**
* Home Controller
* @module      :: Home Controller
*/

var homeService = require("../../services/HomeService");
module.exports = {
    //get home page data, articles and total number of articles for pagination
    'search': function(req, res) {
        var key = req.query.key;
        var page = req.query.page;
        homeService.search(key, page, function(err, articles, total) {
            if (err) {
                return res.status(500);
            }

            return res.status(200).json({ err: false, articles: articles, total: total });
        });
    },
    //get article details
    'get': function(req, res) {
        var nameUrl = req.params.nameUrl;
        var id = req.params.id;
        //return 404 if in the request does not contains nameUrl and id
        if (nameUrl == null || id == null) {
            return res.status(404);
        }
        homeService.get(id, function(err, article) {
            if (err) {
                return res.status(500);
            }
            console.log("dm may");
            return res.status(200).json({ err: false, article: article });
        });
    }
};
