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
                    if (res.status == 200) {
                        alert("Successfully created account as " + $scope.sUsername);
                        $scope.lUsername = $scope.sUsername;
                        $scope.lPassword = $scope.sPassword;
                        $scope.sUsername = "";
                        $scope.sPassword = "";
                    }
                }, function(err) {
                    alert(err.data);
                });
        }
    });
