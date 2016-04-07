SimpleBlogApp.service('AuthSession', ['$cookies', function ($cookies) {
    var store = $cookies.getObject('AuthUser');
    return {
        user: store && store.user,
        create: function (user, expiresTime) {
            this.user = user;

            // setting a cookie object
            var cookieObj = {
                user: this.user,
            };
            
            $cookies.putObject('AuthUser', cookieObj, {
                expires: new Date(Date.now() + expiresTime)
            });
        },
        destroy: function () {
            this.user = null;
            $cookies.remove('AuthUser');
        }
    };
}]);

