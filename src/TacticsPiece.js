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
			.number('defenseChance', { ignore: true, minimum: 0, maximum: 1 })
	},

	/** Return a copy of this piece. Useful to generate new game states.
	*/
	clone: function clone(){
		return new this.constructor(this);
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

