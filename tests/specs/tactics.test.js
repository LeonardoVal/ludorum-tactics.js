/** Test cases for TacticsGame and TacticsPiece.
*/
define(['creatartis-base', 'ludorum', 'ludorum-tactics'], function (base, ludorum, tactics) {
	var declare = base.declare,
		iterable = base.iterable,
		RANDOM = base.Randomness.DEFAULT;	
	
	describe("Basic tests:", function () {
		it("type definitions.", function () {
			expect(typeof tactics.TacticsGame).toBe('function');
			expect(typeof tactics.TacticsPiece).toBe('function');
			
			var p1 = new tactics.TacticsPiece({ owner: 'Left', position: [4,4], hp: 100 });
			expect(p1.damage).toBe(0);
			expect(typeof p1.movement).toBe('number');
			expect(typeof p1.attackChance).toBe('number');
			expect(typeof p1.attackDamage).toBe('number');
			expect(typeof p1.attackRange).toBe('number');
			expect(typeof p1.defenseChance).toBe('number');
		}); // it "type definitions."
		
		it("result calculation.", function () {
			var pL = new tactics.TacticsPiece({ owner: 'Left', position: [0,1], hp: 100 }),
				pR = new tactics.TacticsPiece({ owner: 'Right', position: [0,0], hp: 100 }),
				testGame1 = new tactics.TacticsGame([pL]),
				result = testGame1.result();
			expect(result).toBeTruthy();
			expect(result.Left).toBeGreaterThan(0);
			expect(result.Right).toBeLessThan(0);
			expect(testGame1.moves()).toBeFalsy();
			
			var testGame2 = new tactics.TacticsGame([pR]),
			result = testGame2.result();
			expect(result).toBeTruthy();
			expect(result.Left).toBeLessThan(0);
			expect(result.Right).toBeGreaterThan(0);
			expect(testGame2.moves()).toBeFalsy();
			
			var testGame3 = new tactics.TacticsGame([pL, pR]);
			result = testGame3.result();
			expect(result).toBeFalsy();
			expect(testGame3.moves()).toBeTruthy();
		}); // it "result calculation."
		
		it("plain and clear terrain.", function () {
			var TestGame = declare(tactics.TacticsGame, {
					terrain: new ludorum.utils.CheckerboardFromString(9, 9, 
						base.Iterable.repeat('.', 9 * 9).join('') // Plain 9x9 terrain.
					)
				}),
				p1 = new tactics.TacticsPiece({ owner: 'Left', position: [4,4], movement: 1, attackRange: 9 }),
				p2 = new tactics.TacticsPiece({ owner: 'Right', position: [0,0], movement: 2, attackRange: 9 }),
				game = new TestGame([p1, p2]);
			game.terrain.coordinates().forEach(function (position) {
				expect(game.isPassable(position)).toBe('0,0 4,4'.indexOf(position +'') < 0);
				expect(game.isClear(position)).toBe(true);
			});
			expect(p1.moves(game).sort().join(' ')).toBe([[4,4],[3,4],[5,4],[4,3],[4,5]].sort().join(' '));
			expect(p1.possibleAttacks(game).join(' ')).toBe([1].join(' '));
			expect(p1.pieceInLineOfSight(game, p2)).toBe(true);
			expect(p2.moves(game).sort().join(' ')).toBe([[0,0],[0,1],[1,0],[1,1],[0,2],[2,0]].sort().join(' '));
			expect(p2.possibleAttacks(game).join(' ')).toBe([0].join(' '));
			expect(p2.pieceInLineOfSight(game, p1)).toBe(true);
			
			p2 = p2.moveTo([3,4]);
			game = new TestGame([p1, p2]);
			expect(p1.moves(game).sort().join(' ')).toBe([[4,4],[5,4],[4,3],[4,5]].sort().join(' '));
			expect(p1.pieceInLineOfSight(game, p2)).toBe(true);
			expect(p1.possibleAttacks(game).join(' ')).toBe([1].sort().join(' '));
			expect(p2.moves(game).sort().join(' '))
				.toBe([[3,4],[1,4],[2,3],[2,4],[2,5],[3,2],[3,3],[3,5],[3,6],[4,3],[4,5]].sort().join(' '));
			expect(p2.pieceInLineOfSight(game, p1)).toBe(true);
			expect(p2.possibleAttacks(game).join(' ')).toBe([0].sort().join(' '));
		}); // it "plain and clear terrain."

		it("plain and clear terrain with short attackRange", function () {
			var TestGame = declare(tactics.TacticsGame, {
					terrain: new ludorum.utils.CheckerboardFromString(9, 9, 
						base.Iterable.repeat('.', 9 * 9).join('') // Plain 9x9 terrain.
					)
				}),
				p1 = new tactics.TacticsPiece({ owner: 'Left', position: [4,4], movement: 0, attackRange: 1 }),
				p2 = new tactics.TacticsPiece({ owner: 'Right', position: [0,0], movement: 2, attackRange: 1 }),
				game = new TestGame([p1, p2]);
			game.terrain.coordinates().forEach(function (position) {
				expect(game.isPassable(position)).toBe('0,0 4,4'.indexOf(position +'') < 0);
				expect(game.isClear(position)).toBe(true);
			});
			expect(p1.moves(game).sort().join(' ')).toBe([[4,4]].join(' '));
			expect(p1.possibleAttacks(game).join(' ')).toBe('');
			expect(p1.pieceInLineOfSight(game, p2)).toBe(true);
		});
		
		it("wall terrain.", function () {
			var TestGame = declare(tactics.TacticsGame, {
					terrain: new ludorum.utils.CheckerboardFromString(3, 3, 
						'.#.'+
						'.#.'+
						'.#.'
					)
				}),
				p1 = new tactics.TacticsPiece({ owner: 'Left', position: [1,0], movement: 1, attackRange: 4 }),
				p2 = new tactics.TacticsPiece({ owner: 'Right', position: [1,2], movement: 2, attackRange: 4 }),
				game = new TestGame([p1, p2]);
			game.terrain.coordinates().forEach(function (position) {
				var isWall = game.terrain.square(position) === '#';
				expect(game.isPassable(position)).toBe(!isWall && '1,0 1,2'.indexOf(position +'') < 0);
				expect(game.isClear(position)).toBe(!isWall);
			});
			expect(p1.moves(game).sort().join(' ')).toBe([[1,0],[0,0],[2,0]].sort().join(' '));
			expect(p1.pieceInLineOfSight(game, p2)).toBe(false);
			expect(p2.moves(game).sort().join(' ')).toBe([[1,2],[0,2],[2,2]].sort().join(' '));
			expect(p2.pieceInLineOfSight(game, p1)).toBe(false);
		}); // it "wall terrain."
	}); // describe "Basic tests:"
	
	function testMatch(game, players) {
		var match = new ludorum.Match(game, players),
			label = players.map(function (p) { return p.name; }).join(" vs ");
		match.events.on('move', function (game, moves) {
			var activePlayer = game.activePlayer();
			expect(game.pieces[game.currentPiece]).toBeDefined();
			expect(game.pieces[game.currentPiece].owner).toBe(activePlayer);
			expect(moves.hasOwnProperty(activePlayer)).toBe(true);
			var move = moves[activePlayer];
			// If the current piece has not moved, the move must be an array with a position.
			// Else it should be a number or "pass".
			expect(Array.isArray(move)).toBe(!game.hasMoved);
			//console.log(label +": "+ game +" - "+ JSON.stringify(moves)); // Uncomment to see the match trace.
		});
		match.events.on('end', function (game, result) {
			expect(result[game.players[0]]).not.toBe(0);
			expect(result[game.players[1]]).not.toBe(0);
			expect(result[game.players[0]] + result[game.players[1]]).toBe(0);
			//console.log(label +": "+ game +" ended with "+ JSON.stringify(result)); // Uncomment to see the match trace.
		});
		return match.run(100);
	}
	
	describe("Example game 1:", function () {
		var ExampleGame1 = declare(tactics.TacticsGame, {
				terrain: new ludorum.utils.CheckerboardFromString(6, 6,
					base.Iterable.repeat('.', 6 * 6).join('')
				)
			}),
			Warrior = declare(tactics.TacticsPiece, { name: "Warrior",
				movement: 3, hp: 12, attackChance: 0.8, attackDamage: 10, attackRange: 1.5, defenseChance: 0.5
			}),
			Archer = declare(tactics.TacticsPiece, { name: "Archer",
				movement: 1, hp: 10, attackChance: 0.5, attackDamage: 8, attackRange: 8, defenseChance: 0.3
			}),
			PIECES = [
				new Warrior({ owner: 'Left', position: [0,0] }),
				new Warrior({ owner: 'Left', position: [0,1] }),
				new Archer({ owner: 'Right', position: [5,2] }),
				new Archer({ owner: 'Right', position: [5,3] }),
				new Warrior({ owner: 'Right', position: [5,4] }),
			];
		async_it("test match with Random vs Random.", function () {
			return testMatch(new ExampleGame1(PIECES), [
				new ludorum.players.RandomPlayer({name: "Random1"}), 
				new ludorum.players.RandomPlayer({name: "Random2"})
			]);
		});
	}); // describe "Test matches: "	
}); //// define.
