/** # Tactics game

*/
var TacticsGame = exports.TacticsGame = declare(Game, {
	players : ['Left', 'Right'],
	name : 'TacticsGame',
	noViewTerrains:'x#',
	noWalkTerrains:'o#',

	

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

	constructor: function TacticsGame(pieces,currentPiece,hasMoved){
		//ToDo ver que hacer cuando me llaman sin parámetros.
		Game.call(this, pieces[currentPiece].owner);
		this.pieces = pieces;
		this.currentPiece = currentPiece|0;
		this.hasMoved = !!hasMoved;
	},
	
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
		//ToDo
		var currentPiece = this.pieces[this.currentPiece];
		raiseIf(!moves.hasOwnProperty(currentPiece.owner),
			"Active player has no moves in ", JSON.stringify(moves), "!");
		if (!this.hasMoved) {
			var piece = currentPiece.clone();
			piece.position = moves[currentPiece.owner];
			var newPieces = this.pieces.concat([]);
			newPieces[currentPiece] = piece;
			return new this.constructor(newPieces, this.currentPiece, true);
		} else {
			var index = moves[currentPiece.owner]
			var target = this.pieces[index];
			var enemyPiece = currentPiece.attack(target);
			var newPieces = this.pieces.concat([]);
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
	
	result : function result(){
		var game = this;
		var hasPieces = game.players.map(function(player){
			return game.pieces.filter(function(piece){
				return piece.owner === player;
			}).length > 0;
		});
		if (hasPieces[0] === 0){
			return game.defeat(this.players[0]);
		}
		if (hasPieces[1] === 0) {
			return game.defeat(this.players[1]);
		}
		return null;
	},

	generateThreatMap: function generateThreatMap(){
		//ToDo
	}

}); // declare TacticsGame
