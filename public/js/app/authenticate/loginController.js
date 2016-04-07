SimpleBlogApp.controller('loginController', ['$scope',  '$window', 'AuthSession', 'AuthApi',
    function($scope,  $window, AuthSession, AuthApi) {
        //store init form base data
        $scope.formLogin = {};

        $scope.submitForm = function(isFormValid) {
            if (isFormValid) {
                AuthApi.loginLocal($scope.formLogin, function callback(res) {
                    if (res.err) {
                        $scope.msg = res.msg;
                    } else {
                        //set user cookie
                        AuthSession.create(res.user, res.expires);
                        if (res.user.role == "admin") {
                            $window.location.href = "/admin/home";
                        }
                        else {
                            $window.location.href = "/";
                        }
                    }
                });
            }
        }
    }]);