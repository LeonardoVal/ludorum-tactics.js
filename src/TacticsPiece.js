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
		this.damageRecibed=0;
		this.hitChance=hitChance;
		this.saveChance=saveChance;
		this.attackRange=attackRange;
		this.movement=movement;
		this.owner=owner;
	},

/** Movement of the piece considering the terrain and other pieces that info is passed through game
	cant walk over my pieces
*/
	moves: function moves (game){
		
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
	pieceinLineOfSightbline: function pieceinLineOfSightbline(game,piece){
		//FIXME
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
	        	return pieceinLineOfSightbline(game,piece);
	        break;
	    	default:
	        	default return pieceinLineOfSightbline(game,piece);
}
		
	},
/** Calculates if a 'position' [x0,y0] is in line of sight 
	'methodCode' type of function used to trace distance for bline : 'bline'
*/
	 inLineOfSight: function inLineofSight(game,position,methodCode){
	 	xpiece;
	 	xpiece.position=position;
		switch(expression) {
	    	case 'bline':
	        	return pieceinLineOfSightbline(game,position);
	        break;
	    	default:
	        	default return pieceinLineOfSightbline(game,position);
	},

/** piece must be inLineofSight NO TIENE SENTIDO?
*/
	possibleAttacks: function possibleAttacks(game){
		function pad2(piec) {
        	return Math.sqrt(Math.pow(this.position[0]=piec.position[0],2)+
        		      Math.pow(this.position[1]=piec.position[1],2));
    	}
    	xpieces=[];
		for(piece in game.pieces){
			if (piece.owner!=this.owner && piece.){
					if(pad2(piece)<=this.attackRange){

					}
				}
			}

		}
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
