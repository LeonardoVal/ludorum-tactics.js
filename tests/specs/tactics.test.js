/** Test cases for TacticsGame and TacticsPiece.
*/
define(['creatartis-base', 'ludorum', 'ludorum-tactics'], function (base, ludorum, tactics) {
	var declare = base.declare,
		iterable = base.iterable,
		RANDOM = base.Randomness.DEFAULT;	
	
	describe("Basic tests. ", function () {
		it("Type definitions.", function () {
			expect(typeof tactics.TacticsGame).toBe('function');
			expect(typeof tactics.TacticsPiece).toBe('function');
			
			var p1 = new tactics.TacticsPiece({ owner: 'Left', position: [4,4], hp: 100 });
			expect(p1.damage).toBe(0);
			expect(typeof p1.movement).toBe('number');
			expect(typeof p1.attackChance).toBe('number');
			expect(typeof p1.attackDamage).toBe('number');
			expect(typeof p1.attackRange).toBe('number');
			expect(typeof p1.defenseChance).toBe('number');
		}); // it "Type definitions."
		
		it("Result calculation", function () {
			var pL = new tactics.TacticsPiece({ owner: 'Left', position: [4,4], hp: 100 }),
				pR = new tactics.TacticsPiece({ owner: 'Right', position: [4,4], hp: 100 }),
				testGame1 = new tactics.TacticsGame([pL]),
				result = testGame1.result();
			expect(result).not.toBeFalsy();
			expect(result.Left).toBeGreaterThan(0);
			expect(result.Right).toBeLessThan(0);
			
			var testGame2 = new tactics.TacticsGame([pR]),
			result = testGame2.result();
			expect(result).not.toBeFalsy();
			expect(result.Left).toBeLessThan(0);
			expect(result.Right).toBeGreaterThan(0);
			
			var testGame3 = new tactics.TacticsGame([pL, pR]);
			result = testGame3.result();
			expect(result).toBeFalsy();
		}); // it "Result calculation"
		
		it("Plain and clear terrain", function () {
			var TestGame1 = declare(tactics.TacticsGame, {
					terrain: new ludorum.utils.CheckerboardFromString(9, 9, base.Iterable.repeat('.', 9*9).join(''))
				}),
				p1 = new tactics.TacticsPiece({ owner: 'Left', position: [4,4], hp: 100, movement: 1 }),
				p2 = new tactics.TacticsPiece({ owner: 'Right', position: [0,0], hp: 100, movement: 2 }),
				game = new TestGame1([p1, p2]);
			for (var row = 0; row < 9; row++) {
				for (var column = 0; column < 9; column++) {
					expect(game.isPassable([row, column])).toBe(!(row === 0 && column === 0 || row === 4 && column === 4));
					expect(game.isClear([row, column])).toBe(true);
				}
			}
			expect(p1.moves(game).sort().join(' ')).toBe([[4,4],[3,4],[5,4],[4,3],[4,5]].sort().join(' '));
			expect(p2.moves(game).sort().join(' ')).toBe([[0,0],[0,1],[1,0],[1,1],[0,2],[2,0]].sort().join(' '));
			
			p2 = new tactics.TacticsPiece({ owner: 'Right', position: [3,4], hp: 100, movement: 2 });
			game = new TestGame1([p1, p2]);
			expect(p1.moves(game).sort().join(' ')).toBe([[4,4],[5,4],[4,3],[4,5]].sort().join(' '));
			expect(p2.moves(game).sort().join(' '))
				.toBe([[3,4],[1,4],[2,3],[2,4],[2,5],[3,2],[3,3],[3,5],[3,6],[4,3],[4,5]].sort().join(' '));
		}); // it "Plain and clear terrain"
	}); // describe "Basic tests. "
	
	//TODO More testing.
	
}); //// define.
