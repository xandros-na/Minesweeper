angular.module("minesweeper").config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('index', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: '/views/home.html'
    })
    .state('play', {
        url: '/play',
        controller: 'MainCtrl',
        templateUrl: '/views/game.html'
    });

    //removes # in "/#/<url>"                
    $locationProvider.html5Mode(true);

});
