SimpleBlogApp.directive('lectureContentDirective', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    return {
        restrict: 'A',
        //isolate scope for custom directive
        scope: {
            content: '=content'
        },
        //link is used for modifying the dom
        link: function (scope, element) {
            $timeout(function () {
                var codeBlocks = $(element).find('code');
                for (var i = 0; i < codeBlocks.length; i++) {
                    $(codeBlocks[i]).html(hljs.highlightAuto($(codeBlocks[i]).text()).value);
                }

            }, 0);
        },
        template: "<div ng-bind-html='content'></div>"
    };
}]);