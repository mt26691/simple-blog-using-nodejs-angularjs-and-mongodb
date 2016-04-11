SimpleBlogApp.controller('articleDetailsController', ['$scope', '$routeParams', 'HomeApi', 'authenticateService',
    function($scope, $routeParams, HomeApi, authenticateService) {
        var nameUrl = $routeParams.nameUrl;
        var id = $routeParams.id;
        $scope.err = false;
        $scope.isAuthenticated = authenticateService.isAuthenticated();

        $scope.comment = "";
        HomeApi.getArtcileDetails({ nameUrl: nameUrl, id: id },
            function callback(res) {
                if (res.err) {
                    $scope.err = true;
                    $scope.msg = res.msg;
                }
                else {
                    $scope.article = res.article;
                    $scope.recentArticles = res.recentArticles;
                    $scope.page.setTitle($scope.article.name);
                }
            });
        $scope.submitComment = function submitComment() {
            if ($scope.comment != '') {
                //submit comment for approve
                Comment.save({ comment: $scope.comment }, function callback(data) {
                    if (data.err == false) {
                        $scope.comment = '';
                        $scope.msg = '';
                    }
                    else {
                        $scope.msg = data.msg;
                    }
                });
            }
        }
    }]);
