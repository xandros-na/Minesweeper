var shortid = require('shortid');
var Minesweeper = require('./Minesweeper');
var ioHandler = {};
var queue = [];
var rooms = [];
var games = [];
var lobbyPlayers = 0;

var pair = function(io, room) {
    var p1 = queue[0];
    var p2 = queue[1];
    var room = shortid.generate();
    rooms.push(room);
    p1.socket.join(room);
    p2.socket.join(room);

    var game = new Minesweeper(room, p1.socket.id, p2.socket.id, p1.alias, p2.alias, function(n, turn) {
        if (0 === turn) {
            p1.socket.emit('timeout', {'time': n});
        } else if (1 === turn) {
            p2.socket.emit('timeout', {'time': n});
        }
        if (n==0) {
            game.swapTurn();
            game.timeLeft = 15;
        }
    });

    games.push(game)
    console.log("new game [players]:", game.players[0], game.players[1]);

    io.sockets.in(room).emit('ready', 'your gaem is ready');

    queue.splice(0, 2);
    console.log("ready ");
    console.log("players waiting: ", queue.length);
    lobbyPlayers = lobbyPlayers-2;
    io.sockets.emit('lobby', lobbyPlayers + " playres are sitting in the main lobby");
        
};

ioHandler.checkQueue = function() {
    setInterval(function() {
        if (queue.length >= 2) {
            pair(ioHandler.io);
        }
    }, 5000);
};


var inGame = function(sid) {
    for (var g=0; g<games.length; g++) {
        var game = games[g];
        for (var i=0; i<game.players.length; i++) {
            if (sid === game.players[i]) {
                return {'ingame':true, 'game':game};
            }
        }
    }
    return {'ingame':false, 'game':null};
};

var printBoard = function(game) {
			for(var v = 0; v < game.board.rows; v++){
			   var s = "...";for(var b = 0; b < game.board.cols; b++){s += (game.board.grid[v][b].value == -1)? "*":game.board.grid[v][b].value;}console.log(s);}
};

var sendDataAfterTurn = function(ioHandler, game, res) {
    ioHandler.io.sockets.in(game.room).emit('turn', {'squares':res, 'scores':game.playerScores, 'players': game.alias, 'currentlyPlaying' : game.getTurnWithAlias()});
};

var checkWinner = function(ioHandler, game) {
            /* check winner */
            var winner = game.playerWon();
            if (winner === 2) {
                return winner; 
           } else if (winner === 3) {
               ioHandler.io.sockets.in(game.room).emit('gg', {'winner': 'tie'});
               return winner;
           } else {
               /* someone wins */
               ioHandler.io.sockets.in(game.room).emit('gg', {'winner': winner});
               return winner;
           }
};

ioHandler.handler = function(socket) {
    var newUser = shortid.generate();
    ioHandler.io.to(socket.id).emit('yourName', newUser);
    console.log(newUser, " has joined the main lobby");
    lobbyPlayers++;
    ioHandler.io.sockets.emit('lobby', lobbyPlayers + " players are sitting in the main lobby");
    
    socket.on('lobby', function() {
        ioHandler.io.sockets.emit('lobby', lobbyPlayers + " players are sitting in the main lobby");
    });

    socket.on('joinQueue', function(user) {
        queue.push({'socket':socket, 'alias':newUser});
        console.log(user, " has joined the queue")
    });
    
    socket.on('quit', function() {
        var g = inGame(socket.id);
        if (g.game.players[0] === socket.id) {
            ioHandler.io.to(g.game.players[1]).emit('quit', 'The other player has quit');
        } 
        if (g.game.players[1] === socket.id) {
            ioHandler.io.to(g.game.players[0]).emit('quit', 'The other player has quit');
        } 
        lobbyPlayers = lobbyPlayers + 2;
    });


    socket.on('turn', function(data) {
        var g = inGame(socket.id);

        /* if client is in game */
        if (g.ingame) {
            var game = g.game;

                /* check if its your turn */
                if (game.getTurn() === socket.id && checkWinner(ioHandler, game) === 2) {
                    var i = data.xcord;
                    var j = data.ycord;
                    
                    var res = game.takeTurn(i, j);
                    if (res === false) { //dumb move
                        printBoard(game);
                    } else {
                        sendDataAfterTurn(ioHandler, game, res);
                        checkWinner(ioHandler, game);
			
		            }	
                } else {
                    checkWinner(ioHandler, game);
                }

        } else {
            console.log('player not in game');
        }
    });

    socket.on('disconnect', function(){
        console.log('dc');
        if (lobbyPlayers > 0) {
            lobbyPlayers--;
            ioHandler.io.sockets.emit('lobby', lobbyPlayers + " players are sitting in the main lobby");
        }
    });

};

module.exports = ioHandler;
