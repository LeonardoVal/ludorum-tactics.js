/** # Tactics Piece
*/

var TacticsPiece  = exports.TacticsPiece = declare({
	/** The constructor takes an object with the following data:
	
	+ `owner`: The player that owns (and hence controls) this piece.
	+ `position`: Coordinate (`[row, column]`) in the board where the piece is located.
	+ `movement=1`: Distance the piece can move.
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
			.number('damage', { defaultValue: 0 })
			.integer('movement', { ignore: true, minimum: 1 })
			.integer('hp', { ignore: true, minimum: 1 })
			.number('attackChance', { ignore: true, minimum: 0, maximum: 1 })
			.number('attackDamage', { ignore: true, minimum: 1 })
			.number('attackRange', { ignore: true, minimum: 1 })
			.number('defenseChance', { ignore: true, minimum: 0, maximum: 1 });
	},

	/** The values of properties that do not change during the game should be in the prototype.
	*/
	name: 'TacticsPiece',
	movement: 2,
	hp: 10,
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
		return this.hp <= this.damage;
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

	/** Modified version of the [Bresenham line algorithm
	](http://rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm#JavaScript) to check if there
	is line of sight.
	*/
	bresenham: function bresenham(game, destination) {
 		var x0 = this.position[0], y0 = this.position[1],
			x1 = destination[0], y1 = destination[1],
			dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  		if (dx <= 1 && dy <= 1){
  			return true;
  		}
		var sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1,
			err = (dx > dy ? dx : -dy) / 2, err2;
		while (x0 !== x1 || y0 !== y1) {
		  	if (!game.isClear([x0, y0])) {
				return false;
			}
		    err2 = err;
		    if (err2 > -dx) { 
				err -= dy; 
				x0 += sx;
			}
		    if (err2 < dy) {
				err += dx; 
				y0 += sy;
			}
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
	 	return this.bresenham(game, position);
	},

	/** Returns an array with the indexes in `game.pieces` of the pieces this piece can attack.
	*/
	possibleAttacks: function possibleAttacks(game){
    	var self = this;
		return iterable(game.pieces).filter(function (piece) {
			if (piece !== self && piece.owner != self.owner) {
        		var dist = Math.sqrt(Math.pow(self.position[0] - piece.position[0], 2) + 
        			Math.pow(self.position[1] - piece.position[1], 2));
				return dist <= self.attackRange && self.pieceInLineOfSight(game, piece);
			} else {
				return false;
			}
		}, function (piece, i) {
			return i;
		}).toArray();
	},

	/** Calculates damage to enemy 'piece' considering hit chance. 
		Once its established that you can atack this piece
	*/
	attack: function attack(piece){
		piece = piece.clone();
		piece.damage += this.attackDamage * this.attackChance * (1 - piece.defenseChance);
		return piece;
	},
	
	toString: function toString() {
		return this.name +"("+ 
			this.owner +"@"+ this.position +" "+ (this.hp - this.damage) +"/"+ this.hp +
		")";
	} 
}); // declare TacticsPiece

