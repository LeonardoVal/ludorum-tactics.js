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

var TacticsPiece  = exports.TacticsPiece= declare({
/**
	   hp :Cantidad de unidades 
	   hitChance 0-1
	   saveChance 0-1
	   attackRange 0-3
	   movementSpeed 0-5
	   position xxyy 
	   view distance
	*/
	constructor: function TacticsPiece(hp,hitChance,saveChance,attackRange, movement,position,viewDistance){
		this.position=position;
		this.hp=hp;
		this.hitChance=hitChance;
		this.saveChance=saveChance;
		this.attackRange=attackRange;
		this.movement=movement;
		this.viewDistance=viewDistance;

	},

/** Movement of the piece considering the terrain and other pieces that info is passed through game
*/
	moves: function moves (game){
		
	},



/** NO TESTING MADE 
	If a 'piece' if next to me its visible and you should consider terrain. 
	Calculates if a 'piece' is in line of sight, considering the terrain and type of terrain. 
	variable:
	'noViewTerrains' a string representing all the terrains that cut view example x:mountain, y:fog then 
	noviewTerrains= 'xy')
	
	modified version of Bresenham algorithm 
	http://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm#JavaScript
*/
	pieceinLineOfSightbline: function pieceinLineOfSightbline(game,piece,noViewTerrains){
		//FIXME
 		x0= this.position[0];
 		y0= this.position[1];
 		x1= piece.position[0];
 		y1= piece.position[1];
 		dx = Math.abs(x1 - x0);
 		sx = x0 < x1 ? 1 : -1;
  		dy = Math.abs(y1 - y0);
  		if (dx <=1 && dy<=1 ){
  			return true;
  		}
  		sy = y0 < y1 ? 1 : -1; 
  		err = (dx>dy ? dx : -dy)/2;
		  while (true) {
		  	if (noViewTerrains.search(game.terrain.square([x0,y0])==-1)){return false;}
		    if (x0 === x1 && y0 === y1) break;
		     e2 = err;
		    if (e2 > -dx) { err -= dy; x0 += sx; }
		    if (e2 < dy) { err += dx; y0 += sy; }
		  }
		return true;  
	},
/** Calculates if a 'piece' is in line of sight, considering the terrain and type of terrain of the 'game'. 
*/
	pieceInLineOfSight: function pieceInLineOfSight(game,piece){
		
	},
/** Calculates if a 'position' is in line of sight 
*/
	 inLineOfSight: function inLineofSight(game,position){
		
	},

/** piece must be inLineofSight
*/
	possibleAttacks: function possibleAttacks(game){
		
	},

/** Calculates damage to enemy 'piece' considering hit chance. 
*/
	attack: function attack(game,piece){
		
	},


/** Calculates 'damage' recibed considering 'savechance' considering hit chance. 
*/
	suffer: function suffer(damage){

	}
}); // declare TacticsPiece


/** # Tactics game

*/
var TacticsGame = exports.TacticsGame = declare(Game, {
	players : ['Left', 'Right'],
	name : 'TacticsGame',

	

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
			var piece = this.pieces[this.currentPiece].clone();
			piece.position = moves[currentPiece.owner];
			var newPieces = this.pieces.concat([]);
			newPieces[currentPiece] = piece;
			return new this.constructor(newPieces, this.currentPiece, true);
		} else {
			//TODO
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


// See __prologue__.js
	return exports;
});

//# sourceMappingURL=ludorum-tactics.js.map