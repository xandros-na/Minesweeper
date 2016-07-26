const ROWS = 20;
const COLS = 15;
const MINES = 50;
const TIME = 15;
const GAMEINPROGRESS = 2;
const TIE = 3;

var Square = function(row, col, value, revealed){
	this.mine = -1;
	this.revealed = revealed
	this.row = row;
	this.col = col;
	this.value = (value >= -1 && value <= 8)? value : 0;
}

Square.prototype.getValue = function(){
	return this.value;
};

Square.prototype.setValue = function(n){
	this.value = (n >= -1 && n <= 8)? n : 0;
};

Square.prototype.setMine = function(){
	this.value = this.mine;
};

Square.prototype.isMine = function(){
	return this.value == -1;
};

Square.prototype.isZero = function(){
	return this.value == 0;
};

Square.prototype.reveal = function(){
	this.revealed = true;
};

Square.prototype.isRevealed = function(){
	return this.revealed;
}


//---------------------------------------------


var MinesweeperBoard = function(rows, cols, mines){
	this.mines = mines;
	this.rows = rows;
	this.cols = cols;
	
	this.createGrid();
	this.fillMines();
	this.fillNumbers();
};

MinesweeperBoard.prototype.createGrid = function(){
	this.grid = new Array(this.rows);
  
	for (var i = 0; i < this.rows; i++){
		this.grid[i] = new Array(this.cols);
		for (var j = 0; j < this.cols; j++){
			this.grid[i][j] = new Square(i,j,0,false);
		}
	}
};

MinesweeperBoard.prototype.fillMines = function(){
	if (this.grid != null){
  	var n = this.mines
    while (n > 0){
    	var maxTries = 10000; 
			while(true){
				var row = this.getRandomInt(this.rows);
				var col = this.getRandomInt(this.cols);
				if (!this.grid[row][col].isMine()){
					break;
				}
				maxTries--;
			}
			this.grid[row][col].setMine();
			n--;
		}
	}
};

MinesweeperBoard.prototype.getRandomInt = function(max){
    return Math.floor(Math.random() * (max));
};

MinesweeperBoard.prototype.fillNumbers = function(){
	if (this.grid != null){
		for (var i = 0; i < this.rows; i++){
			for (var j = 0; j < this.cols; j++){
				if (!this.grid[i][j].isMine()){
					this.grid[i][j].setValue(this.getDangerValue(i, j));
				}
			}
		}
	}
};

MinesweeperBoard.prototype.getDangerValue = function(i, j){
	var result = false;
	if (i >= 0 && i < this.rows && j >= 0 && j < this.cols){
		result = 0;
		result += this.isMine(i-1, j);
		result += this.isMine(i-1, j+1);
		result += this.isMine(i, j+1);
		result += this.isMine(i+1, j+1);
		result += this.isMine(i+1, j);
		result += this.isMine(i+1, j-1);
		result += this.isMine(i, j-1);
		result += this.isMine(i-1, j-1);
	}
	return result;
};

MinesweeperBoard.prototype.revealSquare = function(i,j){
	this.grid[i][j].reveal();
};

MinesweeperBoard.prototype.isRevealed = function(i,j){
    if (i >= 0 && i < this.rows && j >= 0 && j < this.cols){
	return this.grid[i][j].isRevealed();
    }else{
	return true;
    }
};

MinesweeperBoard.prototype.getSquareValues = function(i,j){
	var squares = [];
	squares.push(this.grid[i][j]);
	this.revealSquare(i,j);
	if (this.grid[i][j].isZero()){
		squares = this.getSurroundingSquares(squares, i, j);
	}
	return squares;
};

MinesweeperBoard.prototype.getSurroundingSquares = function(squares, i, j){
	var zeros = [];
	if (this.getDangerValue(i-1,j) !== false && !this.isRevealed(i-1,j)){
		this.revealSquare(i-1,j);
		if ((this.grid[i-1][j]).isZero()){
			zeros.push(this.grid[i-1][j]);
		}
		squares.push(this.grid[i-1][j]);
	}
	
	if (this.getDangerValue(i-1,j+1) !== false && !this.isRevealed(i-1,j+1)){
		this.revealSquare(i-1,j+1);
		if ((this.grid[i-1][j+1]).isZero()){
			zeros.push(this.grid[i-1][j+1]);
		}
		squares.push(this.grid[i-1][j+1]);
	}
	
	if (this.getDangerValue(i,j+1) !== false && !this.isRevealed(i,j+1)){
		this.revealSquare(i,j+1);
		if ((this.grid[i][j+1]).isZero()){
			zeros.push(this.grid[i][j+1]);
		}
		squares.push(this.grid[i][j+1]);
	}
	
	if (this.getDangerValue(i+1,j+1) !== false && !this.isRevealed(i+1,j+1)){
		this.revealSquare(i+1,j+1);
		if ((this.grid[i+1][j+1]).isZero()){
			zeros.push(this.grid[i+1][j+1]);
		}
		squares.push(this.grid[i+1][j+1]);
	}
	
	if (this.getDangerValue(i+1,j) !== false && !this.isRevealed(i+1,j)){
		this.revealSquare(i+1,j);
		if ((this.grid[i+1][j]).isZero()){
			zeros.push(this.grid[i+1][j]);
		}
		squares.push(this.grid[i+1][j]);
	} 
	
	if (this.getDangerValue(i+1,j-1) !== false && !this.isRevealed(i+1,j-1)){
		this.revealSquare(i+1,j-1);
		if ((this.grid[i+1][j-1]).isZero()){
			zeros.push(this.grid[i+1][j-1]);
		}
		squares.push(this.grid[i+1][j-1]);
	}
	
	if (this.getDangerValue(i,j-1) !== false && !this.isRevealed(i,j-1)){
		this.revealSquare(i,j-1);
		if ((this.grid[i][j-1]).isZero()){
			zeros.push(this.grid[i][j-1]);
		}
		squares.push(this.grid[i][j-1]);
	}
	
	if (this.getDangerValue(i-1,j-1) !== false && !this.isRevealed(i-1,j-1)){
		this.revealSquare(i-1,j-1);
		if ((this.grid[i-1][j-1]).isZero()){
			zeros.push(this.grid[i-1][j-1]);
		}
		squares.push(this.grid[i-1][j-1]);
	}
	
	for (var i = 0; i < zeros.length; i++){
		var zero = zeros[i];
		if (zero.row != null && zero.col != null){
			var array = this.getSurroundingSquares(squares, zero.row, zero.col);
			for (var j = 0; j < array.length; j++){
				var found  = false;
				for (var k = 0; k < squares.length; k++){
					if (array[j] == squares[k]){
						found = true;
					}
				}
				if (!found){
					squares.push(array[i]);
				}
			}
		}
	}
	
	return squares;
};

MinesweeperBoard.prototype.isMine = function(i, j){
	if (i >= 0 && i < this.rows && j >= 0 && j < this.cols){
		return this.grid[i][j].isMine();
	}
	return 0;
};

MinesweeperBoard.prototype.isZero = function(i, j){
	if (i >= 0 && i < this.rows && j >= 0 && j < this.cols){
		return this.grid[i][j].isZero();
	}
	return true;
};

//--------------------------------------------------



var MinesweeperGame = function(room, player1, player2, a1, a2, callback){
    this.room = room;
	this.turn = 0;
	this.players = [player1, player2];
    this.alias = [a1, a2];
	this.playerScores = [0,0];
	
	this.board = new MinesweeperBoard(ROWS, COLS, MINES);
	this.timeLeft = TIME;
	
	var me = this;
    this.timer = setInterval(function() {
        callback(me.timeLeft, me.turn);
        me.timeLeft--;
	if (me.timeLeft == -1){
	   me.stopInterval();
	}
    }, 1000);
}

MinesweeperGame.prototype.stopInterval = function(){
   clearInterval(this.timer); 
};

MinesweeperGame.prototype.playerWon = function(){
	var difference = Math.abs(this.playerScores[0] - this.playerScores[1]);
	if (difference > this.board.mines || this.board.mines === 0){
        clearInterval(this.timer);
		if (this.playerScores[0] > this.playerScores[1]){
			return this.alias[0];
		}else if (this.playerScores[1] > this.playerScores[0]){
			return this.alias[1];
        } else {
            return TIE;
        }
	}else{
		return GAMEINPROGRESS;
	}
};

MinesweeperGame.prototype.takeTurn = function(i,j){
	if (!this.board.isRevealed(i,j)){
		if (this.board.isMine(i,j)){
			this.playerScores[this.turn]++;
		    this.timeLeft = TIME;
            this.board.mines--;
		}else{
			this.swapTurn();
		    this.timeLeft = TIME;
		}
		return this.board.getSquareValues(i,j);
	}
	return false;
};

MinesweeperGame.prototype.getTurnWithAlias = function(){
	return this.alias[this.turn];
};

MinesweeperGame.prototype.getTurn = function(){
	return this.players[this.turn];
};

MinesweeperGame.prototype.swapTurn = function(){
	if (this.turn == 0){
		this.turn = 1;
	}else if(this.turn == 1){
		this.turn = 0;
	}
};

module.exports = MinesweeperGame;

/*
var game = new MinesweeperGame("nick", "andy");
for (var i = 0; i < game.board.grid.length; i++){
	var s = "";
  for (var j = 0; j < game.board.grid[i].length; j++){
  	if (game.board.grid[i][j].isMine()){
    	s += "* ";
    }else{
  		s += game.board.grid[i][j].getValue() + " ";
    }
  }
  console.log(s);
}

console.log(game.takeTurn(0,0));
console.log(game.takeTurn(0,29));
console.log(game.takeTurn(15,29));
console.log(game.takeTurn(15,0));
console.log(game.takeTurn(7,15));

console.log(game);
*/

/*
var square = new Square(0, false);
console.log(square);
square.setValue(10);
console.log(square);
square.setMine();
console.log(square);
square.reveal(square);
console.log(square);
*/

/*
var board = new MinesweeperBoard(10,20,50);
console.log(board);

for (var i = 0; i < board.grid.length; i++){
	var s = "";
  for (var j = 0; j < board.grid[i].length; j++){
  	if (board.grid[i][j].isMine()){
    	s += "* ";
    }else{
  		s += board.grid[i][j].getValue() + " ";
    }
  }
  console.log(s);
}
*/
