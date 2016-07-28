angular.module("minesweeper").config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/lobby');

    $stateProvider
    /*
    .state('index', {
        url: '/',
        controller: 'MainCtrl',
        templateUrl: '/views/home.html'
    })
    */
    .state('/lobby', {
        url: '/lobby',
        controller: 'LobbyCtrl',
        templateUrl: '/views/lobby.html'
    })
    .state('/play', {
        url: '/play',
        controller: 'GameCtrl',
        templateUrl: '/views/game.html'
    })

    //removes # in "/#/<url>"                
    $locationProvider.html5Mode(true);

});
