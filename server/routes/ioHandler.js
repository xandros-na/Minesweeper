var shortid = require('shortid');
var Minesweeper = require('./Minesweeper');
var ioHandler = {};
var queue = [];
var rooms = [];
var games = [];

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


ioHandler.handler = function(socket) {
    var newUser = shortid.generate();
    ioHandler.io.to(socket.id).emit('yourName', newUser);
    console.log(newUser, " has joined the main lobby");
    
    socket.on('joinQueue', function(user) {
        queue.push({'socket':socket, 'alias':newUser});
        console.log(user, " has joined the queue")
    });


    socket.on('turn', function(data) {
        var g = inGame(socket.id);

        /* if client is in game */
        if (g.ingame) {
            var game = g.game;

            /* check winner */
            var winner = game.playerWon();
            if (!winner) {
                console.log('player turn', game.getTurn());

                /* check if its your turn */
                if (game.getTurn() === socket.id) {
                    var i = data.xcord;
                    var j = data.ycord;
                    
		    console.log(i + ", " + j);
                    var res = game.takeTurn(i, j);
                    if (res === false) { //dumb move
                        console.log(game.rows);console.log(data, " already 'mined'");
			for(var v = 0; v < game.board.rows; v++){
			   var s = "...";for(var b = 0; b < game.board.cols; b++){s += (game.board.grid[v][b].value == -1)? "*":game.board.grid[v][b].value;}console.log(s);}
                    } else {
			
				console.log({'squares':res, 'scores':game.playerScores});
                	ioHandler.io.sockets.in(game.room).emit('turn', {'squares':res, 'scores':game.playerScores, 'players': game.alias, 'currentlyPlaying' : game.getTurnWithAlias()});
		    }	
                   
                } else {
                    //game.stopInterval(function(n, turn) {
                    //    if (0 === turn) {
                    //        ioHandler.io.to(socket.id).emit('timeout', {'time': n});
                    //    } else if (1 === turn) {
                    //        ioHandler.io.to(socket.id).emit('timeout', {'time': n});
                    //    }
                    //    if (n==0) {
                    //        game.swapTurn();
                    //        game.timeLeft = 29;
                    //    }
                    //});
                }
                // if timeout reaches 0 figure swap turns

            } else {
                /* someone wins */
                ioHandler.io.sockets.in(socket.room).emit('gg', {'winner': winner});
            }
        } else {
            console.log('player not in game');
        }
    });

    socket.on('disconnect', function(){
        console.log('dc');
    });

};

module.exports = ioHandler;
