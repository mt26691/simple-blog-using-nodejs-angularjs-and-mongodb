SimpleBlogApp.controller('articleDetailsController', ['$scope', '$routeParams', 'HomeApi',
    function($scope, $routeParams, HomeApi) {
        var nameUrl = $routeParams.nameUrl;
        var id = $routeParams.id;
        $scope.err = false;
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

    }]);
