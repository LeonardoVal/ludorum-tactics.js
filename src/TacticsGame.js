/** # Tactics game

*/
var TacticsGame = exports.TacticsGame = declare(Game, {
	name: 'TacticsGame',
	players: ['Left', 'Right'],

	/** The constructor takes a list of `pieces`, the index of the `currentPiece` and if the current
	piece has moved or not.
	*/
	constructor: function TacticsGame(pieces, currentPiece, hasMoved){
		Game.call(this, pieces[currentPiece |0].owner);
		this.pieces = pieces;
		this.currentPiece = currentPiece |0;
		this.hasMoved = !!hasMoved;
		// Map of positions to pieces, used to speed up move calculations.
		this.__piecesByPosition__ = iterable(pieces).map(function (p) {
			return [p.position +'', p];
		}).toObject();
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
	
	/** Checks if a position in the terrain is passable, allowing pieces to stand on or go through 
	it.
	*/
	isPassable: function isPassable(position) {
		return '.x'.indexOf(this.terrain.square(position)) >= 0 && !this.__piecesByPosition__[position +'']; 
	},
	
	/** Checks if a position in the terrain is clear, allowing pieces to see what is there or though
	it.
	*/
	isClear: function isClear(position) {
		return '.o'.indexOf(this.terrain.square(position)) >= 0; 
	}, 
	
	// ## Game logic ###############################################################################
	 
	/** If the current pieces has not moves, returns its possible moves. If it has moves, returns 
	its attacks. If 
	*/
	moves: function moves(){
		if (!this.hasOwnProperty('__moves__')) { // this.__moves__ is used to cache the move calculations.
			var currentPiece = this.pieces[this.currentPiece];
			if (currentPiece && !this.result()) { // There is a current piece and the game has not finished.
				if (!this.hasMoved) {
					this.__moves__ = currentPiece.moves(this);
				} else {
					this.__moves__ = currentPiece.possibleAttacks(this);
				}
			} else {
				this.__moves__ = null;
			}
		}
		return this.__moves__;
	},

	/** Builds the next game state with the given move.
	*/
	next: function next(moves){
		var currentPiece = this.pieces[this.currentPiece],
			newPieces = this.pieces.concat([]);
		raiseIf(!moves.hasOwnProperty(currentPiece.owner), "Active player has no moves in ", JSON.stringify(moves), "!");
		if (!this.hasMoved) {
			newPieces[currentPiece] = currentPiece.moveTo(moves[currentPiece.owner]);
			return new this.constructor(newPieces, this.currentPiece, true);
		} else {
			var index = moves[currentPiece.owner],
				target = this.pieces[index],
				attackedPiece = currentPiece.attack(target);
			if (attackedPiece.isDestroyed()) {
				if (index < this.currentPiece) {
					this.currentPiece--;
				}
				newPieces.splice(index,1);
			} else {
				newPieces[index] = attackedPiece;
			}
			return new this.constructor(newPieces, (this.currentPiece+1) % this.pieces.length, false);
		}
	}, 
	
	/** By default the player that loses all their pieces loses.
	*/
	result: function result(){
		var game = this,
			pieceCounts = iterable(this.players).map(function (player) {
				var count = game.pieces.filter(function (piece){
					return piece.owner === player;
				}).length;
				return [player, count];
			}).toObject();
		if (pieceCounts.Left < 1) {
			return this.victory('Right', pieceCounts.Right);
		} else if (pieceCounts.Right < 1) {
			return this.victory('Left', pieceCounts.Left);
		} else {
			return null;
		}
	}
}); // declare TacticsGame
