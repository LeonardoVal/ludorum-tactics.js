/** # Tactics game

*/
var TacticsGame = exports.TacticsGame = declare(Game, {
	players : ['Left', 'Right'],
	name : 'TacticsGame',
	noViewTerrains:'x#',
	noWalkTerrains:'o#',

	/** The constructor takes a list of `pieces`, the index of the `currentPiece` and if the current
	piece has moved or not.
	*/
	constructor: function TacticsGame(pieces, currentPiece, hasMoved){
		Game.call(this, pieces[currentPiece].owner);
		this.pieces = pieces;
		this.currentPiece = currentPiece |0;
		this.hasMoved = !!hasMoved;
	},
	
	// ## Terrain ##################################################################################
	
	terrain: new ludorum.utils.CheckerboardFromString(10, 15,
		'...x...........'+
		'...x.....o.....'+
		'.......xxo.....'+
		'.........#.....'+
		'.........#.....'+
		'..oo#..........'+
		'..oox..........'+
		'........oox....'+
		'....xx.........'+
		'.........#.....'
	),
	
	// ## Game logic ###############################################################################
	 
	/**
	Gets movements. 
	*/
	moves: function moves(){
		var currentPiece = this.pieces[this.currentPiece];
		if (!this.hasMoved) {
			return currentPiece.moves(this);
		} else {
			return currentPiece.possibleAttacks(this);
		}
	},

	next : function next(moves){
		var currentPiece = this.pieces[this.currentPiece],
			newPieces = this.pieces.concat([]);
		raiseIf(!moves.hasOwnProperty(currentPiece.owner),
			"Active player has no moves in ", JSON.stringify(moves), "!");
		if (!this.hasMoved) {
			var piece = currentPiece.clone();
			piece.position = moves[currentPiece.owner];
			newPieces[currentPiece] = piece;
			return new this.constructor(newPieces, this.currentPiece, true);
		} else {
			var index = moves[currentPiece.owner];
			var target = this.pieces[index];
			var enemyPiece = currentPiece.attack(target);
			if (enemyPiece.isAlive()) {
				newPieces[index] = enemyPiece;
			} else {
				if (index < this.currentPiece) {
					this.currentPiece--;
				}
				newPieces.splice(index,1);
			}
			return new this.constructor(newPieces, (this.currentPiece+1) % this.pieces.length, false);
		}
	}, 
	
	/** By default the player that loses all their pieces loses.
	*/
	result : function result(){
		var pieceCount, player;
		for (var i = 0; i < this.players; ++i) {
			player = this.players[i];
			pieceCount = game.pieces.filter(function(piece){
				return piece.owner === player;
			}).length;
			if (pieceCount < 1){
				return game.defeat(player);
			}
		}
		return null;
	}
}); // declare TacticsGame
