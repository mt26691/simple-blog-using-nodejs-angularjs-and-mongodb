
SimpleBlogApp.controller('verifyAccountController', ['$scope', '$routeParams', 'Account',
    function($scope, $routeParams, Account) {

        var verifyAccountToken = $routeParams.verifyAccountToken;

        if (!verifyAccountToken) {
            $scope.err = true;
        }
        else {
            Account.verifyAccount({ verifyAccountToken: verifyAccountToken }, function callback(data) {
                if (data.err) {
                    $scope.err = true;
                }
                else {
                    $scope.err = false;
                    $scope.email = data.email;
                }
            });
        }
    }]);
