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
		  	if (game.noViewTerrains.search(game.terrain.square([x0,y0])==-1)){return false;}
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
