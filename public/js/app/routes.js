//ROUTES
SimpleBlogApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    window.routes = {
        '/':
        {
            title: "Simple blog using nodejs angularjs mongodb",
            templateUrl: '/templates/home.html',
            controller: 'homeController'
        },
        '/page-:page':
        {
            title: "Simple blog using nodejs angularjs mongodb",
            templateUrl: '/templates/home.html',
            controller: 'homeController'
        },
        '/admin/dashboard':
        {
            // templateUrl: '/templates/admin/user/users.html',
            templates: "<div></div>",
            controller: 'userController',
            role: 'admin'
        },
        '/admin/user':
        {
            templateUrl: '/templates/admin/user/users.html',
            controller: 'userController',
            role: 'admin'
        },
        '/admin/article':
        {
            templateUrl: '/templates/admin/article/article.html',
            controller: 'articleController',
            role: 'admin'
        },
        '/tai-khoan/:userId?':
        {
            title: 'Tài khoản',
            templateUrl: '/templates/account/userProfile.html',
            controller: 'getUserProfileController',
            //notAllowLoggedInUser:true
        },
        '/register':
        {
            title: 'register',
            templateUrl: '/templates/authenticate/register.html',
            controller: 'registerController',
        },
        '/log-in':
        {
            title: 'Log in',
            templateUrl: '/templates/authenticate/login.html',
            controller: 'loginController',
        },
        '/forgot-password':
        {
            title: 'Forgot password',
            templateUrl: '/templates/account/forgot-password.html',
            controller: 'forgotPasswordController',
        },
        '/doi-mat-khau':
        {
            title: 'Đổi mật khẩu',
            templateUrl: '/templates/account/change-password.html',
            controller: 'changePasswordController',
            //notAllowLoggedInUser:true
        },
        '/doi-thong-tin/:isChanged?':
        {
            title: 'Đổi thông tin',
            templateUrl: '/templates/account/change-profile.html',
            controller: 'changeProfileController',
            //notAllowLoggedInUser:true
        },
        '/reset-password/:passwordResetToken?':
        {
            title: 'Reset password',
            templateUrl: '/templates/account/reset-password.html',
            controller: 'resetPasswordController'
        },
        '/about-us':
        {
            title: 'About us',
            templateUrl: '/templates/infor/about-us.html',
        },
        '/policies':
        {
            title: 'About us',
            templateUrl: '/templates/infor/policies.html',
        },
        '/:nameUrl/:id':
        {
            templateUrl: '/templates/article_details.html',
            controller: 'articleDetailsController'
        }
    };

    for (var path in window.routes) {
        $routeProvider.when(path, window.routes[path]);
    }

    $routeProvider.otherwise({ redirectTo: '/log-in' });
    $locationProvider.html5Mode(true);

}]);