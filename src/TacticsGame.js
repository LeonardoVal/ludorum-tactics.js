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
