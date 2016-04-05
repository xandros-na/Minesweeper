var MinesweeperView = function(canvas){
	this.canvas = canvas.getContext("2d");	

	this.startX = 0;
	this.startY = 0;
	this.timer = 0;
	this.turn = false;

	this.squareSize = 30;
	this.rows = 20;
	this.cols = 15;
    this.loaded = false;
	this.images = this.loadImages();

	
	canvas.height = this.startY + this.squareSize*this.rows;
	canvas.width = this.startX + this.squareSize*this.cols;
};

MinesweeperView.prototype.isTurn = function(){
	return this.turn;
};

MinesweeperView.prototype.setTimer = function(n){
	this.timer = n;
	this.turn = (this.timer < 1)? false : true;
};

MinesweeperView.prototype.loadImages = function(){
	var  imageArray = [];
    this.loadImage(imageArray, "../static/resources/square.png", "square");
	this.loadImage(imageArray, "../static/resources/bomb1.png", "bomb1");
	this.loadImage(imageArray, "../static/resources/bomb2.png", "bomb2");
	this.loadImage(imageArray, "../static/resources/one.jpg", "one");
	this.loadImage(imageArray, "../static/resources/two.jpg", "two");
	this.loadImage(imageArray, "../static/resources/three.jpg", "three");
	this.loadImage(imageArray, "../static/resources/four.jpg", "four");
	this.loadImage(imageArray, "../static/resources/five.jpg", "five");
	this.loadImage(imageArray, "../static/resources/six.jpg", "six");
	this.loadImage(imageArray, "../static/resources/seven.jpg", "seven");
	this.loadImage(imageArray, "../static/resources/eight.jpg", "eight");
    console.log("loaded");
    return imageArray;
};

MinesweeperView.prototype.loadImage = function(array, path, src){
	array[src] = new Image();
    var me = this;
    array[src].onload = function(){
        if (src === "square") {
        me.grid = me.createBoard(me.rows, me.cols, me.startX, me.startY);
        }
        
    };
    
    array[src].src = path;
	array[src].width = this.squareSize;
	array[src].height = this.squareSize;
};

MinesweeperView.prototype.createBoard = function(rows, cols, startX, startY){
	var board = [];
	for (var i = 0; i < rows; i++){
		var row = [];
		for (var j = 0; j < cols; j++){
			var topLeftX = startX + this.squareSize*j;
			var topLeftY = startY + this.squareSize*i;

			row.push({x: topLeftX, y: topLeftY});
			this.setSquare(row[j], null);
		}
		board.push(row);
	}
};

MinesweeperView.prototype.setSquare = function(square, value, turn) {
	switch(value){
		case -1:
			var img = turn ? this.images["bomb1"] : this.images["bomb2"];
			this.canvas.drawImage(img, square.x, square.y, this.squareSize, this.squareSize);
			break;
        case 0:
            this.canvas.fillStyle = "#FFCDD2";
            this.canvas.fillRect(square.x, square.y, this.squareSize, this.squareSize);
            break;
		case 1:
			this.canvas.drawImage(this.images["one"], square.x, square.y, this.squareSize, this.squareSize);
			break;
		case 2:
			this.canvas.drawImage(this.images["two"], square.x, square.y, this.squareSize, this.squareSize);
			break;
		case 3:
			this.canvas.drawImage(this.images["three"], square.x, square.y, this.squareSize, this.squareSize);
			break;
		case 4:
			this.canvas.drawImage(this.images["four"], square.x, square.y, this.squareSize, this.squareSize);
			break;
		case 5:
			this.canvas.drawImage(this.images["five"], square.x, square.y, this.squareSize, this.squareSize);
			break;
		case 6:
			this.canvas.drawImage(this.images["six"], square.x, square.y, this.squareSize, this.squareSize);
			break;
		case 7:
			this.canvas.drawImage(this.images["seven"], square.x, square.y, this.squareSize, this.squareSize);
			break;
		case 8:
			this.canvas.drawImage(this.images["eight"], square.x, square.y, this.squareSize, this.squareSize);
			break;
		default:
			this.canvas.drawImage(this.images["square"], square.x, square.y, this.squareSize, this.squareSize);
			break;
		}
};

MinesweeperView.prototype.getSquare = function(mouseX, mouseY){	
    var col = Math.floor(mouseX/this.squareSize); 
	var row = Math.floor(mouseY/this.squareSize);	
	return {xcord: row, ycord: col};
};

MinesweeperView.prototype.isMouseInBounds = function(mousePos, start, end){
	if (mousePos >= start && mousePos < end){
		return true;
	}
	return false;
};
