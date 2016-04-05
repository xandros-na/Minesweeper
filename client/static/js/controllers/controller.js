angular.module("minesweeper")
    .controller("MainCtrl", function($scope, $http, $location) {
        $scope.sUsername = "";
        $scope.lUsername = "";
        $scope.sPassword = "";
        $scope.lPassword = "";

        $scope.login = function() {
            $http.post('/api/login', 
                {'username': $scope.lUsername,
                 'password': $scope.lPassword})
                .then(function(res) {
                    console.log(res);
                    $location.path('/play');
                }, function(err) {
                    alert(err.data);
                });
        }

        $scope.signUp = function() {
            $http.post('/api/signUp', 
                {'username': $scope.sUsername,
                 'password': $scope.sPassword})
                .then(function(res) {
                    console.log(res);
                }, function(err) {
                    alert(err.data);
                });
        }
    });
