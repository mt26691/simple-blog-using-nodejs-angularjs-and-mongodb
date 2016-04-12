
//controler for change-profile.html
SimpleBlogApp.controller('changeProfileController', ['$scope', '$routeParams', '$window', 'Account',
    function($scope,  $routeParams, $window, Account) {
        //store init form base data
        $scope.changeProfileForm = {};
        if ($routeParams.isChanged == 'thanh-cong') {
            $scope.msg = "Thông tin tài khoản thay đổi thành công";
            $scope.isChanged = true;
        }
        
        $scope.submitForm = function(isFormValid) {
            if (isFormValid) {
                Account.changeProfile($scope.changeProfileForm, function callback(data) {
                    if (data.err) {
                        $scope.msg = data.msg;
                        $scope.isChanged = false;
                    }
                    else {
                        $scope.msg = data.msg;;
                        $scope.isChanged = true;
                        $window.location.href = $window.location.href + "/thanh-cong";
                    }
                });

            }
        }
    }]);
