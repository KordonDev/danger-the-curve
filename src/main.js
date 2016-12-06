'use strict';

const GameState = require('./GameState');

const wrapper = document.getElementById('wrapper');
const configArea = document.getElementById('config');
const startButton = document.getElementById('start');

startButton.addEventListener('click', () => {
	resetApp();
	const container = document.createElement('div');
	container.className = 'container';
	wrapper.appendChild(container);
	const userConfig = JSON.parse(configArea.value);
	const game = new GameState(Object.assign({
		container: container,
		size: [1000, 700]
	}, userConfig));

	game.start();
});

function resetApp() {
	const oldContainer = document.getElementsByClassName('container');
	if(oldContainer.length > 0) {
		oldContainer[0].remove();
	}
}
