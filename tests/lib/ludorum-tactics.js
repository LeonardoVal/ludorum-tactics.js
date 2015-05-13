/** Package wrapper and layout.
*/
(function (global, init) { "use strict"; // Universal Module Definition.
	if (typeof define === 'function' && define.amd) {
		define(['creatartis-base', 'ludorum'], init); // AMD module.
	} else if (typeof module === 'object' && module.exports) {
		module.exports = init(require('creatartis-base'), require('ludorum')); // CommonJS module.
	} else { // Browser or web worker (probably).
		global.ludorum_gamepack = init(global.base, global.ludorum); // Assumes base is loaded.
	}
})(this, function __init__(base, ludorum) { "use strict";
// Import synonyms. ////////////////////////////////////////////////////////////////////////////////
	var declare = base.declare,
		iterable = base.iterable,
		initialize = base.initialize,
		Game = ludorum.Game,
		raise = base.raise,
		raiseIf = base.raiseIf;

// Library layout. /////////////////////////////////////////////////////////////////////////////////
	var exports = {
		__name__: 'ludorum-tactics',
		__init__: __init__,
		__dependencies__: [base, ludorum]
	};

/** # Tactics Piece
*/

var TacticsPiece  = exports.TacticsPiece = declare({
	/** The constructor takes an object with the following data:
	
	+ `owner`: The player that owns (and hence controls) this piece.
	+ `position`: Coordinate (`[row, column]`) in the board where the piece is located.
	+ `movement=1`: Distance the piece can move.
	+ `hp`: Amount of health points.
	+ `damage=0`: Amount of damage received.
	+ `attackChance`: Chance of hiting a target while attacking.
	+ `attackDamage`: Maximum amount of damage this piece's attack can do.
	+ `attackRange`: Maximum distance upto which a target can be attacked.
	+ `defenseChance`: Chance of saving an attack.
	*/	
	constructor: function TacticsPiece(props){
		initialize(this, props)
			.string('owner')
			.array('position', { length: 2, elementType: base.types.INTEGER })
			.number('damage', { defaultValue: 0 })
			.integer('movement', { ignore: true, minimum: 1 })
			.integer('hp', { ignore: true, minimum: 1 })
			.number('attackChance', { ignore: true, minimum: 0, maximum: 1 })
			.number('attackDamage', { ignore: true, minimum: 1 })
			.number('attackRange', { ignore: true, minimum: 1 })
			.number('defenseChance', { ignore: true, minimum: 0, maximum: 1 });
	},

	/** The values of properties that do not change during the game should be in the prototype.
	*/
	name: 'TacticsPiece',
	movement: 2,
	hp: 10,
	attackChance: 0.5,
	attackDamage: 10,
	attackRange: 4,
	defenseChance: 0.3,
	
	/** Return a copy of this piece. Useful to generate new game states.
	*/
	clone: function clone(){
		return new this.constructor(this);
	},

	/** Return true if piece has been destroyed.
	*/
	isDestroyed: function isDestroyed(){
		return this.hp <= this.damage;
	},
	
	/** Calculates the array of positions in the terrain where this piece can move to.
	*/
	moves: function moves(game){
    	var visited = {},
			pending = [this.position], 
			current, up, left, right, down;
    	for (var ms = 0; ms <= this.movement; ms++) {
			current = pending;
			pending = [];
    		current.forEach(function (xpos) {	
	    		if (!(xpos in visited)) {
		    		visited[xpos] = xpos;
		    		up = [xpos[0], xpos[1] + 1];
		    		left = [xpos[0] - 1, xpos[1]];
		    		right = [xpos[0] + 1, xpos[1]];
		    		down = [xpos[0], xpos[1] - 1];
		    		[up, left, right, down].forEach(function (p) {
		    			if (game.isPassable(p)) {
		    				pending.push(p);
		    			}
		    		});
		    	}
    		});
		}    	
    	return iterable(visited).select(1).toArray(); // Return the values of visited.
	},
	
	/** Builds a clone of this piece with its position changed to the given `position`.
	*/
	moveTo: function moveTo(position) {
		var r = this.clone();
		r.position = position;
		return r;
	},

	/** Modified version of the [Bresenham line algorithm
	](http://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm#JavaScript) to check if there
	is line of sight.
	*/
	bresenham: function bresenham(game, destination) {
 		var x0 = this.position[0], y0 = this.position[1],
			x1 = destination[0], y1 = destination[1],
			dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  		if (dx <= 1 && dy <= 1){
  			return true;
  		}
		var sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1,
			err = (dx > dy ? dx : -dy) / 2, err2;
		while (x0 !== x1 || y0 !== y1) {
		  	if (!game.isClear([x0, y0])) {
				return false;
			}
		    err2 = err;
		    if (err2 > -dx) { 
				err -= dy; 
				x0 += sx;
			}
		    if (err2 < dy) {
				err += dx; 
				y0 += sy;
			}
		}  
		return true;  
	},
	
	/** Checks if the given `piece` is in line of sight of this piece, considering the terrain of 
	the `game`.
	*/
	pieceInLineOfSight: function pieceInLineOfSight(game, piece){
		return this.inLineOfSight(game, piece.position);				
	},
	
	/** Checks if a `position` ([row,column]) is in line of sight of this piece, considering the 
	terrain of the `game`.
	*/
	inLineOfSight: function inLineofSight(game, position){
	 	return this.bresenham(game, position);
	},

	/** Returns an array with the indexes in `game.pieces` of the pieces this piece can attack.
	*/
	possibleAttacks: function possibleAttacks(game){
    	var self = this;
		return iterable(game.pieces).filter(function (piece) {
			if (piece !== self && piece.owner != self.owner) {
        		var dist = Math.sqrt(Math.pow(self.position[0] - piece.position[0], 2) + 
        			Math.pow(self.position[1] - piece.position[1], 2));
				return dist <= self.attackRange && self.pieceInLineOfSight(game, piece);
			} else {
				return false;
			}
		}, function (piece, i) {
			return i;
		}).toArray();
	},

	/** Calculates damage to enemy 'piece' considering hit chance. 
		Once its established that you can atack this piece
	*/
	attack: function attack(piece){
		piece = piece.clone();
		piece.damage += this.attackDamage * this.attackChance * (1 - piece.defenseChance);
		return piece;
	},
	
	toString: function toString() {
		return this.name +"("+ 
			this.owner +"@"+ this.position +" "+ (this.hp - this.damage) +"/"+ this.hp +
		")";
	} 
}); // declare TacticsPiece



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


// See __prologue__.js
	return exports;
});

//# sourceMappingURL=ludorum-tactics.js.map