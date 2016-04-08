var assert = require('assert');
var supertest = require("supertest");
var testConfig = require('../testConfig');
var server = supertest.agent(testConfig.host + ":" + testConfig.port);
var apiURL = testConfig.homeApi;
var initData = require('../initData');

describe('Admin Home Controller Test', function() {
    var newUsers = [];
    var oldUsers = [];
    var newArticles = [];
    var oldArticles = [];

    beforeEach(function(done) {
        initData(function(returnData) {
            newUsers = returnData.newUsers;
            oldUsers = returnData.oldUsers;
            newArticles = returnData.newArticles;
            oldArticles = returnData.oldArticles;
            done();
        });
    });

    it('user go to home page, see all active articles', function(done) {
        server
            .get(apiURL)
            .expect('Content-type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.status.should.equal(200); // OK
                assert.equal(3, res.body.subjects.length);
                done();
            });

    });

    //query in api/v1/admin/CommentController.js with param: keyword = Comment, page = 2
    it('user can see active articles details', function(done) {
        server
            .get(testConfig.homeApi + newSubjects[1].nameUrl + "/" + newChapters[1].nameUrl + "/" + newLectures[0].nameUrl)
            .expect('Content-type', /json/)
            .end(function(err, res) {
                assert.equal(false, res.body.err);
                done();
            });
    });

    //get in api/v1/admin/CommentController.js
    it('user can not see inactive article details', function(done) {
        server
            .get(testConfig.homeApi + newSubjects[1].nameUrl + "/" + newChapters[1].nameUrl + "/" + newLectures[4].nameUrl)
            .expect('Content-type', /json/)
            .end(function(err, res) {
                assert.equal(true, res.body.err);
                done();
            });
    });

    //get in api/v1/admin/CommentController.js
    it('user can not see lecture with wrong url', function(done) {
        server
            .get(testConfig.homeApi + newSubjects[1].nameUrl + "/" + newChapters[1].nameUrl + "/" + "zxc")
            .expect('Content-type', /json/)
            .end(function(err, res) {
                assert.equal(true, res.body.err);
                done();
            });
    });

    after(function(done) {
        done();
    });

});