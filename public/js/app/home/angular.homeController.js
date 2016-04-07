//CONTROLLER
SimpleBlogApp.controller('masterHomeController', ['$scope', '$rootScope', '$http', '$location',
    function($scope, $rootScope, $http, $location) {
        $scope.currentUser = $rootScope.currentUser;
        $scope.isAuthenticated = $rootScope.isAuthenticated;
        $scope.userRoles = $rootScope.userRoles;

        $scope.searchForm = { key: "" };
        $scope.search = function() {
            if ($scope.searchForm.key != null && $scope.searchForm.key.length > 0) {
                $location.path('/tim-kiem').search('tuKhoa', $scope.searchForm.key).search("trang", null);
            }
        }
    }]);

//CONTROLLER
SimpleBlogApp.controller('homeController', ['$scope', '$rootScope', 'HomeApi',
    function($scope, $rootScope, HomeApi) {
        $scope.currentUser = $rootScope.currentUser;
        $scope.isAuthenticated = $rootScope.isAuthenticated;
        $scope.userRoles = $rootScope.userRoles;
        
        HomeApi.get({}, function callback(res) {
            $scope.subjects = res.subjects;
        });
    }]);
