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
	+ `movement=1`: Distance the piece can move. It must be between 1 and 4.
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
			.integer('movement', { defaultValue: 1, minimum: 1, maximum: 4 })
			.integer('hp')
			.integer('damage', { defaultValue: 0 })
			.number('attackChance', { ignore: true, minimum: 0, maximum: 1 })
			.number('attackDamage', { ignore: true, minimum: 1 })
			.number('attackRange', { ignore: true, minimum: 1, maximum: 3 })
			.number('defenseChance', { ignore: true, minimum: 0, maximum: 1 });
	},

	/** The values of properties that do not change during the game should be in the prototype.
	*/
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
		return this.hp <= this.damageReceived;
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

/** NO TESTING MADE 
	If a 'piece' if next to me its visible and you should consider terrain. 
	Calculates if a 'piece' is in line of sight, considering the terrain and type of terrain. 
	variable:
	'game.noViewTerrains' a string representing all the terrains that cut view example x:mountain, y:fog then 
	noviewTerrains= 'xy')
	
	modified version of Bresenham algorithm 
	http://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm#JavaScript
*/
	BresenhamLineAlgorithm: function BresenhamLineAlgorithm(game, piece){
		//FIXME should i use this to calculate posibleatacks instead euclidean distance
 		var x0= this.position[0];
 		var y0= this.position[1];
 		var x1= piece.position[0];
 		var y1= piece.position[1];
 		var dx = Math.abs(x1 - x0);
 		var sx = x0 < x1 ? 1 : -1;
  		var dy = Math.abs(y1 - y0);
  		if (dx <=1 && dy<=1 ){
  			return true;
  		}
  		var sy = y0 < y1 ? 1 : -1; 
  		var err = (dx>dy ? dx : -dy)/2;
		  while (true) {
		  	if (game.noViewTerrains.search(game.terrain.square([x0,y0])==-1)){return false;}
		    if (x0 === x1 && y0 === y1) break;
		    	var  e2 = err;
		    if (e2 > -dx) { err -= dy; x0 += sx; }
		    if (e2 < dy) { err += dx; y0 += sy; }
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
	 	return true; //FIXME this.bresenham(game, position));
	},

	/** piece must be inLineofSight NO TIENE SENTIDO?
	*/
	possibleAttacks: function possibleAttacks(game){
    	var self = this;
		return game.pieces.filter(function (piece){
			if (piece.owner != self.owner) {
        		var dist = Math.sqrt(Math.pow(self.position[0] - piece.position[0], 2) + 
        			Math.pow(self.position[1] - piec.position[1], 2));
				return dist <= self.attackRange && self.pieceInLineOfSight(game, piece);
			} else {
				return false;
			}
		});
	},

	/** Calculates damage to enemy 'piece' considering hit chance. 
		Once its established that you can atack this piece
	*/
	attack: function attack(piece){
		piece = piece.clone();
		piece.damageReceived += this.damage * this.hitChance * (1-piece.saveChance);
		return piece;
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


// See __prologue__.js
	return exports;
});

//# sourceMappingURL=ludorum-tactics.js.map