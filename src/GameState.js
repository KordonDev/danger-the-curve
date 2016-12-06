'use strict';

const Player = require('./Player');
const ItemManager = require('./ItemManager');

const TICK_TIME = 1000 / 60;
const SPAWN_STEP_RATE = 0.1;

class GameState {
	constructor(options) {
		this.options = options;
		this.hitMap = new Uint8Array(options.size[0] * options.size[1]);
		this.players = this.options.players.map((playerConfig, i) => { return new Player(playerConfig, this, i + 1); });
		this.itemManager = new ItemManager(options.items, this);
		this._registerKeymap();
		this._registerCanvas();
		this._registerStateDisplay();
	}

	_registerKeymap() {
		this.keyMap = {};
		window.addEventListener('keydown', (event) => {
			this.keyMap[event.key] = true;
			if(this.roundOver && event.key === 'r') {
				this.roundOver = false;
				this._reset();
				this.start();
			}
		});
		window.addEventListener('keyup', (event) => { this.keyMap[event.key] = false; });
	}

	_registerStateDisplay() {
		const element = document.createElement('div');
		element.className = 'state';
		this.options.container.appendChild(element);
		this.stateDisplay = element;
	}

	_registerCanvas() {
		const element = document.createElement('canvas');
		element.width = this.options.size[0];
		element.height = this.options.size[1];
		this.options.container.appendChild(element);
		this.options.drawContext = element.getContext('2d');
	}

	_renderState() {
		this.stateDisplay.innerHTML = this.players.map((player) => player.toStateString()).join('');
	}

	start() {
		this._renderState();
		this.running = true;
		this.timestamp = performance.now();
		requestAnimationFrame(this.tick.bind(this));
	}

	stop() {
		this.running = false;
	}

	_reset() {
		this.clearHitmap();
		this.options.drawContext.clearRect(0, 0, this.options.size[0], this.options.size[1]);
		this.players.forEach((player) => player.initPosition());
	}

	tick() {
		if(this.running) {
			requestAnimationFrame(this.tick.bind(this));
		}
		const newTimestamp = performance.now();
		const timeElapsed = newTimestamp - this.timestamp;
		const ticks = timeElapsed / TICK_TIME;

		for(let i = 0; i < this.players.length; i++) {
			this.players[i].tick(ticks);
		}

		if(Math.random() < SPAWN_STEP_RATE) {
			this.itemManager.spawn();
		}

		this.timestamp = newTimestamp;
	}

	clearHitmap() {
		this.hitMap.fill(0);
	}

	setHitmap(vec, val) {
		this.hitMap[Math.floor(vec[1]) * this.options.size[0] + Math.floor(vec[0])] = val;
	}

	getHitmap(vec) {
		return this.hitMap[Math.floor(vec[1]) * this.options.size[0] + Math.floor(vec[0])]; 
	}

	playerDied(index) {
		let alive = 0;
		this.players.forEach((player) => {
			if(player.index !== index) {
				player.points++;
			}
			if(!player.dead) {
				alive++;
			}
		});
		this._renderState();
		if(alive === 1) {
			this.stop();
			this.roundOver = true;
		}
	}

}


module.exports = GameState;
