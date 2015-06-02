var APP = {};

require.config({
	paths: {
		'creatartis-base': '../lib/creatartis-base', 
		ludorum: '../lib/ludorum',
		'ludorum-tactics': '../lib/ludorum-tactics'
	}
});
require(['creatartis-base', 'ludorum', 'ludorum-tactics'], function (base, ludorum, tactics) {
	APP.imports = {base: base, ludorum: ludorum};
	APP.elements = {
		selectLeft: document.getElementById('playerLeft'),
		selectRight: document.getElementById('playerRight'),
		buttonReset: document.getElementById('reset'),
		footer: document.getElementsByTagName('footer')[0]
	};

// Player options. /////////////////////////////////////////////////////////////
	var PLAYER_OPTIONS = APP.PLAYER_OPTIONS = [
		{title: "You", builder: function () { 
			return new ludorum.players.UserInterfacePlayer(); 
		}, runOnWorker: false },
		{title: "Random", builder: function () { 
			return new ludorum.players.RandomPlayer();
		}, runOnWorker: false },
		{title: "MonteCarlo (10 sims)", builder: function () {
			return new ludorum.players.MonteCarloPlayer({ simulationCount: 10 });
		}, runOnWorker: false }
	];
	APP.players = [PLAYER_OPTIONS[0].builder(), PLAYER_OPTIONS[0].builder()];
	PLAYER_OPTIONS.forEach(function (option, i) {
		var html = '<option value="'+ i +'">'+ option.title +'</option>';
		APP.elements.selectLeft.innerHTML += html;
		APP.elements.selectRight.innerHTML += html;
	});
	APP.elements.selectLeft.onchange = 
	APP.elements.selectRight.onchange = function () {
		var i = this === APP.elements.selectLeft ? 0 : 1,
			option = PLAYER_OPTIONS[+this.value];
		(option.runOnWorker
			? ludorum.players.WebWorkerPlayer.create({ playerBuilder: option.builder })
			: base.Future.when(option.builder())
		).then(function (player) {
			APP.players[i] = player;
			APP.reset();
		});
	};

// Buttons. ////////////////////////////////////////////////////////////////////
	APP.elements.buttonReset.onclick = APP.reset = function reset() {
		var piece1 = new tactics.TacticsPiece({ owner: 'Left', position: [1,0], movement: 1, attackRange: 4 }),
			piece2 = new tactics.TacticsPiece({ owner: 'Right', position: [5,7], movement: 2, attackRange: 4 }),
			game = new tactics.TacticsGame([piece1, piece2]),
			match = new ludorum.Match(game, APP.players);
		APP.ui = new ludorum.players.UserInterface.BasicHTMLInterface({ match: match, container: 'board' });
		match.events.on('begin', function (game) {
			APP.elements.footer.innerHTML = base.Text.escapeXML("Turn "+ game.activePlayer() +".");
		});
		match.events.on('next', function (game, next) {
			APP.elements.footer.innerHTML = base.Text.escapeXML("Turn "+ next.activePlayer() +".");
		});
		match.events.on('end', function (game, results) {
			APP.elements.footer.innerHTML = base.Text.escapeXML(results['Left'] === 0 ? 'Drawed game.'
				: (results['Left'] > 0 ? 'Left' : 'Right') +' wins.');
		});
		match.run(200);
	};
	
// Start.
	APP.reset();
}); // require().
