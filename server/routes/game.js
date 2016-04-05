var game = function(roomId, p1, p2) {
    this.roomId = roomId;
    this.p1 = p1;
    this.p2 = p2;
};

game.prototype.move = function() {
};

module.exports = game;
