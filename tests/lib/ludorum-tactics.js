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
		Game = ludorum.Game;

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
	*/
	constructor: function TacticsPiece(hp,hitChance,saveChance,attackRange, movement,position){
		this.position=position;
		this.hp=hp;
		this.hitChance=hitChance;
		this.saveChance=saveChance;
		this.attackRange=attackRange;
		this.movement=movement;

	},

/** Movement of the piece considering the terrain and other pieces that info is passed through game
*/
	moves: function moves (game){
		
	},

/** Calculates if a piece is in line of sight, considering the terrain and type of terrain. 
*/
	pieceInLineOfSight: function pieceInLineOfSight(game,piece){
		
	},
/** Calculates if a position is in line of sight 
*/
	 inLineOfSight: function inLineofSight(game,position){
		
	},

/** piece must be inLineofSight
*/
	possibleAttacks: function possibleAttacks(game){
		
	},

/** Calculates damage to enemy piece considering hit chance. 
*/
	attack: function attack(game,piece){
		
	},

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


	constructor: function TacticsGame(activePlayer,pieces){
		//ToDo 
	},
	/**
	Gets movements. 
	*/
	moves: function moves(){
		//ToDo
	},
	next : function next(moves){
		//ToDo
	}, 
	result : function result(){
		//ToDo
	}


}); // declare TacticsGame


// See __prologue__.js
	return exports;
});

//# sourceMappingURL=ludorum-tactics.js.map