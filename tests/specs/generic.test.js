// This is a copy fo similar test cases used in ludorum.
define(['creatartis-base', 'ludorum', 'ludorum-tactics'], function (base, ludorum, tactics) {
	var RANDOM = base.Randomness.DEFAULT;	
	
	describe("Basic tests. ", function () {
		it("TacticsGame is defined.", function () {
			expect(typeof tactics.TacticsGame).toBe('function');
		}); // it "TacticsGame is defined."
	}); // describe "Basic tests. "
	
	//TODO More testing.
	
}); //// define.
