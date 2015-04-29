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

/**
	Clone method
*/
clone: function clone(){
	var xclone=new TacticsPiece();
		xclone.position=this.position;
		xclone.hp=this.hp;
		xclone.damageRecibed=this.damageRecibed;
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


	return list of moves ([x,y],...,[xn,yn])
*/
	moves: function moves (game){
		function canImoveThere(position){
			var x0=position[0];
			var y0=position[1];
			if (game.noViewTerrains.search(game.terrain.square([x0,y0])==-1)){return false;}
			else{return true}
    	}
    	for (var direction in [0,1,2,3]){
    		for (var move=0   :move<=this.movementSpeed :move++){
	    		switch(direction) {
			    	case 0:
			    		break;
			    	case 1:
			    		break;
			    	case 2:
			    		break;
			    	case 3:
			    		break;
		        }
		    }
		}		

    	
    	var x0=position[0];
		var y0=position[1];

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
		

    	var xpieces=[];
		for( var piece in game.pieces){
			if (piece.owner!=this.owner && piece.hp>piece.damageRecibed && pieceInLineOfSight(game,piece,'bline')){
        			euqDist= Math.sqrt(Math.pow(this.position[0]-piec.position[0],2)+Math.pow(this.position[1]-piec.position[1],2));
					if(euqDist<=this.attackRange){
						xpieces[xpieces.length+1]=piece;
					}
			}
		}
		return xpieces;
	},

/** Calculates damage to enemy 'piece' considering hit chance. 
	Once its established that you can atack this piece
*/
	attack: function attack(piece){
		piece.suffer(hitChance);
	},


/** Calculates 'damage' recibed considering 'savechance' considering hit chance. 

*/
	suffer: function suffer(damage){
		this.damage += damage*(1-saveChance);
	}
}); // declare TacticsPiece

