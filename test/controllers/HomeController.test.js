var assert = require('assert');
var supertest = require("supertest");
var testConfig = require('../testConfig');
var server = supertest.agent(testConfig.host + ":" + testConfig.port);
var apiURL = testConfig.homeApi;
var initData = require('../initData');

describe('Admin Home Controller Test', function () {
    var newUsers = [];
    var oldUsers = [];
    var newSubjects = [];
    var oldSubjects = [];
    var newChapters = [];
    var oldChapters = [];
    var newLectures = [];
    var oldLectures = [];
    var newComments = [];
    var oldComments = [];

    beforeEach(function (done) {
        initData(function (returnData) {
            newUsers = returnData.newUsers;
            oldUsers = returnData.oldUsers;
            newSubjects = returnData.newSubjects;
            oldSubjects = returnData.oldSubjects;
            newChapters = returnData.newChapters;
            oldChapters = returnData.oldChapters;
            newLectures = returnData.newLectures;
            oldLectures = returnData.oldLectures;
            oldComments = returnData.oldComments;
            newComments = returnData.newComments;
            done();
        });
    });

    it('user go to home page, see all active subject', function (done) {
        server
            .get(apiURL)
            .expect('Content-type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200); // OK
                assert.equal(3, res.body.subjects.length);
                done();
            });

    });
    
    //query in api/v1/admin/CommentController.js
    it('user can see active subjects details', function (done) {
        server
            .get(testConfig.homeApi + newSubjects[1].nameUrl)
            .expect('Content-type', /json/)
            .end(function (err, res) {
                assert.equal(false, res.body.err);
                //only return 3 active chapter
                assert.equal(3, res.body.chapters.length);
                done();
            });
    });


    it('API return attended subject status for logged user', function (done) {
        var apiAuth = testConfig.apiAuthUrl + '/login/local';
        server
            .post(apiAuth)
            .send(oldUsers[3])  // log in as admin
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                assert.equal(true, !res.body.err);  // check if login is ok
                server
                    .get(testConfig.homeApi + newSubjects[1].nameUrl)
                    .expect('Content-type', /json/)
                    .end(function (err, res) {
                        assert.equal(false, res.body.err);
                        assert.equal(false, res.body.attendedResult.isAttended);
                        assert.equal(3, res.body.chapters.length);
                        done();
                    });
            });
    });

    it('Let user joins unattended subject', function (done) {
        var apiAuth = testConfig.apiAuthUrl + '/login/local';
        var subjectToJoin = { subject: newSubjects[1].nameUrl };

        server
            .post(apiAuth)
            .send(oldUsers[3])  // log in as admin
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                assert.equal(true, !res.body.err);  // check if login is ok
                server
                    .post(testConfig.apiAccountUrl + "/attendSubject")
                    .send(subjectToJoin)
                    .expect('Content-type', /json/)
                    .end(function (err, res) {
                        
                        assert.equal(false, res.body.err);
                        done();
                    });
            });
    });

    it.only('not let user joins attended subject', function (done) {
        var apiAuth = testConfig.apiAuthUrl + '/login/local';
        var subjectToJoin = { subject: newSubjects[1].nameUrl };

        server
            .post(apiAuth)
            .send(oldUsers[3])  // log in as admin
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                assert.equal(true, !res.body.err);  // check if login is ok
                server
                    .post(testConfig.apiAccountUrl + "/attendSubject")
                    .send(subjectToJoin)
                    .expect('Content-type', /json/)
                    .end(function (err, res) {

                        assert.equal(false, res.body.err);

                        server
                            .post(testConfig.apiAccountUrl + "/attendSubject")
                            .send(subjectToJoin)
                            .expect('Content-type', /json/)
                            .end(function (err, res) {
                                assert.equal(true, res.body.err);
                                done();
                            });

                    });
            });
    });

    it('let users see their attended subjects', function (done) {
        var apiAuth = testConfig.apiAuthUrl + '/login/local';
        var subjectToJoin = { subject: newSubjects[1].nameUrl };

        server
            .post(apiAuth)
            .send(oldUsers[3])  // log in as admin
            .expect('Content-type', /json/)
            .end(function (err, res) {
                res.status.should.equal(200);
                assert.equal(true, !res.body.err);  // check if login is ok
                server
                    .post(testConfig.homeApi + "attendSubject")
                    .send(subjectToJoin)
                    .expect('Content-type', /json/)
                    .end(function (err, res) {
                        assert.equal(false, res.body.err);
                        server
                            .get(testConfig.apiAccountUrl + "/mySubjects")
                            .expect('Content-type', /json/)
                            .end(function (err, res) {
                                
                                assert.equal(false, res.body.err);
                                assert.equal(1, res.body.subjects.length);
                                done();
                            });
                    });
            });
    });

    //     it.only('not let inactive user join subject', function (done) {
    //         var apiAuth = testConfig.apiAuthUrl + '/login/local';
    //         var subjectToJoin = { subject: newSubjects[1].nameUrl };
    // 
    //         server
    //             .post(apiAuth)
    //             .send(oldUsers[1])  // log in as inactive user
    //             .expect('Content-type', /json/)
    //             .end(function (err, res) {
    //                 res.status.should.equal(200);
    //                 assert.equal(false, !res.body.err);  // check if login is ok
    //                 server
    //                     .post(testConfig.homeApi + "attendSubject")
    //                     .send(subjectToJoin)
    //                     .expect('Content-type', /json/)
    //                     .end(function (err, res) {
    //                         assert.equal(true, res.body.err);
    //                         done();
    //                     });
    //             });
    //     });
    
    //query in api/v1/adminin/CommentController.js with param: page 2
    it('user can not see inactive subjects details', function (done) {
        server
            .get(testConfig.homeApi + newSubjects[4].nameUrl)
            .expect('Content-type', /json/)
            .end(function (err, res) {
                assert.equal(true, res.body.err);
                done();
            });
    });
    
    //query in api/v1/adminin/CommentController.js with param: page 2
    it('user can not see wrong subject', function (done) {
        server
            .get(testConfig.homeApi + "abc xyz")
            .expect('Content-type', /json/)
            .end(function (err, res) {
                assert.equal(true, res.body.err);
                done();
            });
    });
    
    //query in api/v1/admin/CommentController.js with param: keyword = Comment content 05
    it('user can see active lecture, with subjectNameUrl + chapterNamerl', function (done) {
        server
            .get(testConfig.homeApi + newSubjects[1].nameUrl + "/" + newChapters[1].nameUrl)
            .expect('Content-type', /json/)
            .end(function (err, res) {
                assert.equal(false, res.body.err);
                assert.equal(3, res.body.subject.chapters.length);
                assert.equal(3, res.body.lectures.length);
                done();
            });
    });

    it('user can not see active lecture, with wrong subjectNameUrl + chapterNamerl', function (done) {
        server
            .get(testConfig.homeApi + newSubjects[1].nameUrl + "/" + "abs")
            .expect('Content-type', /json/)
            .end(function (err, res) {
                assert.equal(true, res.body.err);
                done();
            });

    });

    it('user can not see active lecture, with right subjectNameUrl + chapterNamerl, but the chapter is inactive', function (done) {
        server
            .get(testConfig.homeApi + newSubjects[1].nameUrl + "/" + newLectures[0].nameUrl)
            .expect('Content-type', /json/)
            .end(function (err, res) {
                assert.equal(true, res.body.err);
                done();
            });

    });
    
    //query in api/v1/admin/CommentController.js with param: keyword = Comment, page = 2
    it('user can see active lecture, with subjectNameUrl, lectureNameUrl and chapterNameUrl', function (done) {
        server
            .get(testConfig.homeApi + newSubjects[1].nameUrl + "/" + newChapters[1].nameUrl + "/" + newLectures[0].nameUrl)
            .expect('Content-type', /json/)
            .end(function (err, res) {
                assert.equal(false, res.body.err);
                done();
            });
    });
    
    //get in api/v1/admin/CommentController.js
    it('user can not see inactive lecture', function (done) {
        server
            .get(testConfig.homeApi + newSubjects[1].nameUrl + "/" + newChapters[1].nameUrl + "/" + newLectures[4].nameUrl)
            .expect('Content-type', /json/)
            .end(function (err, res) {
                assert.equal(true, res.body.err);
                done();
            });
    });
    
    //get in api/v1/admin/CommentController.js
    it('user can not see lecture with wrong url', function (done) {
        server
            .get(testConfig.homeApi + newSubjects[1].nameUrl + "/" + newChapters[1].nameUrl + "/" + "zxc")
            .expect('Content-type', /json/)
            .end(function (err, res) {
                assert.equal(true, res.body.err);
                done();
            });
    });

    after(function (done) {
        done();
    });

});