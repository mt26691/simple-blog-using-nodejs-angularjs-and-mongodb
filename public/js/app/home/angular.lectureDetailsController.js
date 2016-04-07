SimpleBlogApp.controller('lectureDetailsController', ['$scope', '$routeParams', 'authenticateService', 'HomeApi', 'Comment',
    function($scope, $routeParams, authenticateService, HomeApi, Comment) {
        var subjectNameUrl = $routeParams.subjectNameUrl;
        var chapterNameUrl = $routeParams.chapterNameUrl;
        var lectureNameUrl = $routeParams.lectureNameUrl;
        if (lectureNameUrl == null) {
            lectureNameUrl = '';
        }

        $scope.currentUser = authenticateService.currentUser();
        $scope.isAuthenticated = authenticateService.isAuthenticated();
        $scope.userRoles = authenticateService.getRole();

        $scope.remain = 512;
        $scope.err = false;
        $scope.isLoading = true;
        //get lectures
        HomeApi.getLectureDetails({ subject: subjectNameUrl, chapter: chapterNameUrl, lecture: lectureNameUrl },
            function callback(res) {
                if (res.err) {
                    $scope.err = true;
                    $scope.msg = res.msg;
                }
                else {
                    $scope.subject = res.subject;
                    $scope.chapters = res.subject.chapters;
                    $scope.selectedChapter = res.selectedChapter;
                    $scope.lectures = res.lectures;
                    $scope.selectedLecture = res.selectedLecture;
                    $scope.selectedLecture.content = $scope.selectedLecture.content;
                    $scope.comments = res.comments;
                    $scope.commentForm = { comment: "", lecture: $scope.selectedLecture.id };
                    $scope.page.setTitle($scope.selectedLecture.name);
                }
                $scope.isLoading = false;
            });

        $scope.keyUp = function() {
            var length = $scope.commentForm.content.length;
            $scope.remain = 512 - length;
        }

        $scope.submit = function() {
            //validate comment
            if ($scope.commentForm.content.length > 0) {
                Comment.save($scope.commentForm, function callback(res) {
                    if (res.err) {
                        $scope.err = true;
                        $scope.msg = res.msg;
                    }
                    else {
                        $scope.err = false;
                        $scope.msg = "";
                        $scope.commentForm = { content: "", lecture: $scope.selectedLecture.id };
                        $scope.keyUp();
                        $scope.comments.push(res.data);
                    }
                });
            }
        }

        $scope.deleteComment = function(comment) {
            Comment.delete({ "id": comment.id }, function callback(res) {
                if (res.err) {
                    $scope.err = true;
                    $scope.msg = res.msg;
                }
                else {
                    //delete comment by using jQuery
                    $.each($scope.comments, function(i) {
                        if ($scope.comments[i].id === comment.id) {
                            $scope.comments.splice(i, 1);
                            return false;
                        }
                    });

                }
            });
        }
    }]);
