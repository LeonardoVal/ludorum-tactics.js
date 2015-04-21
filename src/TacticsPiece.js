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
