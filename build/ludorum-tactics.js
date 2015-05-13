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
	   
	*/
	constructor: function TacticsPiece(hp,hitChance,saveChance,attackRange, movement,position,owner){
		this.position=position;
		this.hp=hp;
		this.damageReceived=0;

		this.hitChance=hitChance;
		this.saveChance=saveChance;

		this.attackRange=attackRange;
		this.movement=movement;
		this.owner=owner;
	},

/**
	Clone method
*/
clone: function clone(){
	var xclone=new TacticsPiece();
		xclone.position=this.position;
		xclone.hp=this.hp;
		xclone.damageReceived=this.damageReceived;
		xclone.hitChance=this.hitChance;
		xclone.saveChance=this.saveChance;
		xclone.attackRange=this.attackRange;
		xclone.movement=this.movement;
		xclone.owner=this.owner;
	return xclone;

},


/** Movement of the piece considering the terrain and other pieces that info is passed through game
	cant walk over my pieces
	Calculo paso n 
	Guardo paso n. en listareturn y en lista next
	Calculo paso n+1 de lista next 
	Guardo paso n+1 en listareturn y en lista next
	repito hasta que movimientos =0
	Matrix for movements, 

	return list of moves ([x,y],...,[xn,yn])
*/
	moves: function moves(game){
    	var visited={};
    	var listToDo=[this.position];
    	for (var ms = 0; ms <= this.movementSpeed; ms++){	
    		listToDo.forEach(function (xpos) {	
	    		if (!(xpos in visited)) {
		    		visited[xpos] = xpos;
		    		var up=[xpos[0],xpos[1]+1];
		    		var le=[xpos[0]-1,xpos[1]];
		    		var ri=[xpos[0]+1,xpos[1]];
		    		var dw=[xpos[0],xpos[1]-1];
		    		[up,le,ri,dw].forEach(function (p) {
		    			if (game.noWalkTerrains.search(game.terrain.square(p)) < 0) {
		    				listToDo.push(p);
		    			}
		    		});
		    	}
    		});
		}    	
    	return iterable(visited).select(1).toArray();
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
	BresenhamLineAlgorithm: function BresenhamLineAlgorithm(game,piece){
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
/** Calculates if a 'piece' is in line of sight, considering the terrain and type of terrain of the 'game',
	'methodCode' type of function used to trace distance for bline : 'bline'
*/
	pieceInLineOfSight: function pieceInLineOfSight(game,piece,methodCode){
		switch(expression) {
	    	case 'bline':
	        	return v=(this.BresenhamLineAlgorithm(game,piece));
	    	default:
	        	 return v=(this.BresenhamLineAlgorithm(game,piece));
		}				
	},
/** Calculates if a 'position' [x0,y0] is in line of sight 
	'methodCode' type of function used to trace distance for bline : 'bline'
*/
	 inLineOfSight: function inLineofSight(game,position,methodCode){
	 	var xpiece=new TacticsPiece();
	 	xpiece.position= position;
		switch(expression) {
	    	case 'bline':
	        	return v= (this.BresenhamLineAlgorithm(game,position));
	    	default:
	        	return v=(this.BresenhamLineAlgorithm(game,position));
	        }
	},
/** piece must be inLineofSight NO TIENE SENTIDO?
*/
	possibleAttacks: function possibleAttacks(game){
    	var self = this;
		return game.pieces.filter(function (piece){
			if (piece.owner != self.owner && pieceInLineOfSight(game, piece, 'bline')) {
        		var dist = Math.sqrt(Math.pow(self.position[0] - piece.position[0], 2) + 
        			Math.pow(self.position[1] - piec.position[1], 2));
				return dist <= self.attackRange;
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
	},

/** Return true if piece has not been destroyed yet.
*/
	isAlive: function isAlive(){
		return this.hp > this.damageReceived;
	}


}); // declare TacticsPiece



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