SimpleBlogApp.service('authenticateService', ['$http', '$rootScope', 'AuthSession',
    function($http, $rootScope, AuthSession) {
        return {
            getRole: function() {
                if (!!AuthSession.user) {
                    return AuthSession.user.role;
                }
                return "";
            },
            isAuthenticated: function() {
                return !!AuthSession.user;
            },
            currentUser: function() {
                return AuthSession.user;
            },
            isAuthorized: function(authorizedRoles) {
                if (authorizedRoles == null || authorizedRoles == "") {
                    return true;
                }
                return this.isAuthenticated() && authorizedRoles.indexOf(this.currentUser().role) !== -1;
            },
            removeUserSession: function() {
                AuthSession.destroy();
            },
            updateAuthState: function() {
                $rootScope.currentUser = this.currentUser();
                $rootScope.isAuthenticated = this.isAuthenticated();
                $rootScope.userRoles = this.getRole();
            }
        }
    }]);

