//MODULE
var SimpleBlogApp = angular.module('SimpleBlogApp', ['ngRoute', 'ngResource', 'ngMessages',
    'ui.bootstrap', 'ngCookies',
    'api-services', 'toastr', 'angular-confirm', 'monospaced.elastic',
    'ckeditor', 'ngSanitize', 'angulartics', 'angulartics.google.analytics', 'flow'])
    .config([
        'toastrConfig', '$httpProvider',
        function(toastrConfig, $httpProvider) {
            //angular toast tr config
            angular.extend(toastrConfig, {
                autoDismiss: false,
                containerId: 'toast-container',
                maxOpened: 0,
                newestOnTop: true,
                positionClass: 'toast-bottom-right',
                preventDuplicates: false,
                preventOpenDuplicates: false,
                target: 'body'
            });
        }
    ]);

SimpleBlogApp.run(['$rootScope', function($rootScope) {
    $rootScope.page = {
        setTitle: function(title) {
            this.title = title + ' | hocdai.com';
        }
    }

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.page.setTitle(current.$$route.title || 'Học đại | hocdai.com');
    });
}]);

SimpleBlogApp.run(['$http', '$rootScope', 'authenticateService', '$window', function($http, $rootScope, authenticateService, $window) {
    //update authentication state when load
    authenticateService.updateAuthState();
    $rootScope.itemsPerPage = 5;
    $rootScope.maxPagingSize = 10;
}]);

//app constant
SimpleBlogApp.constant('config', {
    appName: 'Simple blog using nodejs angularjs mongodb',
    appVersion: 2.0,
    apiUrl: 'http://localhost:1337/',
    itemsPerPage: 5,
    maxPagingSize: 10,
    //dashboard 
    apiGetDashboardData: '/api/v1/admin/dashboard/getDashboardData',
    //account
    apiSendPasswordResetEmail: '/api/v1/account/sendPasswordResetEmail',
    apiGetResetPasswordData: '/api/v1/account/getResetPasswordData',
    apiResetPassword: '/api/v1/account/resetPassword',
    apiChangePassword: '/api/v1/account/changePassword',
    apiChangeProfile: '/api/v1/account/changeProfile',
    //end account
    apiLoginLocal: '/api/v1/auth/login/local',
    apiAuthUrl: '/api/v1/auth',
    apiAccountUrl: '/api/v1/account',
    apiUserUrl: '/api/v1/admin/user',
    //upload image /api/v1/admin/uploadImage
    apiUploadArticleImage :'/api/v1/admin/uploadImage/uploadArticleImage',
    apiUploadImage :'/api/v1/admin/uploadImage/uploadImage',
});
