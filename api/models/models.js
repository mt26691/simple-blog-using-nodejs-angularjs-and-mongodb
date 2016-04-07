var mongoose = require('mongoose');

module.exports = function() {

    var User =
        mongoose.model('User', require('./user'), 'User');

    var Article =
        mongoose.model('Article', require('./article'), 'Article');

    var AccessToken =
        mongoose.model('AccessToken', require('./accessToken'), 'AccessToken');

    var models = {
        User: User,
        AccessToken: AccessToken,
        Article: Article
    };

    return models;
};
