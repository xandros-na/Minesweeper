angular.module("minesweeper", ["ui.router", "ngResource"])
    .run(function($rootScope) {
        $rootScope.$on("$stateChangeError", console.log.bind(console));
    });

