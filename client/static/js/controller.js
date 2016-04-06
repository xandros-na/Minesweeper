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
                    $location.path('/lobby');
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
    })
    .factory("Socket", function() {
        var socket = {};
        var myName = "";
        
        var init = function() {
            socket = io();
        };

        var setName = function(name) {
            myName = name;
        };

        var getName = function() {
            return myName;
        };

        var getSocket = function() {
            return socket;
        }

        return {
            init: init,
            setName: setName,
            getName: getName,
            getSocket: getSocket
        };
            
    })
    .controller("LobbyCtrl", function($scope, $location, $state, Socket) {
        Socket.init()
        var socket = Socket.getSocket();

        $scope.lobby = "";
        socket.on("yourName", function(name) {
            Socket.setName(name);
        });

        socket.on("lobby", function(lobby) {
            console.log(lobby);
            $scope.lobby = lobby;
            $scope.$apply();
        });

        $scope.join = function() {
            socket.emit("joinQueue", Socket.getName());
        };

        socket.on("ready", function() {
            console.log("ready");
            $state.go('/play');
        });

        console.log(socket);
    })
    .controller("GameCtrl", function($scope, $document, $state, Socket) {
            var socket = Socket.getSocket();
            var myName = Socket.getName();

		    var view = new MinesweeperView(document.getElementById("myCanvas"));


            document.getElementById("myCanvas").
                addEventListener('mousedown', function(event){
                    var turn = view.getSquare(event.pageX, event.pageY);
		            socket.emit("turn", turn);
		    }, false);

            $scope.time = "15";
            $scope.p1Score = "0";
            $scope.p2Score = "0";

     	    socket.on('turn', function(v) {
                    var squares = v.squares;
                    var turn = v.currentlyPlaying == myName;
                    for(var s=0; s<squares.length; s++) {
                        view.setSquare({y: squares[s].row*30, x:squares[s].col*30}, squares[s].value, turn);
                    }
                    
                    console.log("here");
                    if (v.players[0] == myName) {
                        $scope.p1Score = v.scores[0]; 
                        $scope.p2Score = v.scores[1];
                    } 
                    if (v.players[1] == myName) {
                        $scope.p1Score = v.scores[1]; 
                        $scope.p2Score = v.scores[0];
                    }
                    $scope.$apply();
            });

            socket.on('timeout', function(v) {
                    v.time == 0 ? $scope.time = "Player 2s turn!" : $scope.time = v.time;
                    $scope.$apply();
            });

            $scope.quit = function() {
                socket.emit('quit', '');
                $state.go('/lobby');
            };

            socket.on('quit', function(d) {
                alert(d + " we're taking you back to the main lobby");
                socket.emit('lobby', '');
                $state.go('/lobby');
            });

            socket.on('gg', function(d) {
                alert(d.winner);
            });
    });
