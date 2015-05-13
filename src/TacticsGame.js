/** # Tactics game

*/
var TacticsGame = exports.TacticsGame = declare(Game, {
	name: 'TacticsGame',
	players: ['Left', 'Right'],

	/** The constructor takes a list of `pieces`, the index of the `currentPiece` and if the current
	piece has moved or not.
	*/
	constructor: function TacticsGame(pieces, currentPiece, hasMoved){
		currentPiece = currentPiece |0;
		if (!pieces[currentPiece]) {
			raise("Current piece ", currentPiece, " is not valid (pieces: ", JSON.stringify(pieces), ")!");
		}
		Game.call(this, pieces[currentPiece].owner);
		this.pieces = pieces;
		this.currentPiece = currentPiece;
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
				this.__moves__ = {};
				if (!this.hasMoved) {
					this.__moves__[currentPiece.owner] = currentPiece.moves(this);
				} else {
					this.__moves__[currentPiece.owner] = ['pass'].concat(currentPiece.possibleAttacks(this));
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
		if (!moves.hasOwnProperty(currentPiece.owner)) {
			console.log(this +"\n"+ JSON.stringify(moves) +" from "+ JSON.stringify(this.moves()) +"!");//FIXME
			delete this.__moves__;
			console.log("\t"+ JSON.stringify(this.moves()) +"?");//FIXME
			raise("Active player ", currentPiece.owner, " has no moves in ", JSON.stringify(moves), "!");
		}
		var move = moves[currentPiece.owner];
		if (!this.hasMoved) {
			newPieces[this.currentPiece] = currentPiece.moveTo(move);
			return new this.constructor(newPieces, this.currentPiece, true);
		} else {
			var nextPiece = this.currentPiece + 1;
			if (move !== 'pass') {
				var target = this.pieces[move],
					attackedPiece = currentPiece.attack(target);
				if (attackedPiece.isDestroyed()) {
					if (move < this.currentPiece) {
						nextPiece--;
					}
					newPieces.splice(move, 1);
				} else {
					newPieces[move] = attackedPiece;
				}
			}
			return new this.constructor(newPieces, nextPiece % newPieces.length, false);
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
	},
	
	// ## Utilities ################################################################################
	
	__serialize__: function __serialize__() {
		return [this.name, this.pieces, this.currentPiece, this.hasMoved];
	},
	
	toString: function toString() {
		var game = this;
		return this.name +"("+ this.currentPiece +":"+ this.pieces[this.currentPiece] +" "+ 
			(this.hasMoved ? "attacks" : "moves") +
			this.pieces.map(function (p, i) {
				return i === game.currentPiece ? "" : ", "+ i +":"+ p;
			}).join("") +
		")";
	}
}); // declare TacticsGame
