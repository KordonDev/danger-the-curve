'use strict';

const Player = require('./Player');
const ItemManager = require('./ItemManager');

const TICK_TIME = 1000 / 60;

class GameState {
	constructor(options) {
        // converts all keys to lower case
        options.players.forEach((player) => {
            player.controls = player.controls.map((key) => key.toLowerCase());
        });
		this.options = options;
		this.hitMap = new Uint8Array(options.size[0] * options.size[1]);
		this.players = this.options.players.map((playerConfig, i) => { return new Player(playerConfig, this, i + 1); });
		this.itemManager = new ItemManager(options.items, this);
		this._registerKeymap();
		this._registerCanvas();
		this._registerStateDisplay();
		this.classes = [];
	}

	//TODO refactor this for GameState, Player and items at once
	removeClass(clazz) {
		this.classes.splice(this.classes.indexOf(clazz), 1);
		this._renderClasses();
	}

	addClass(clazz) {
		this.classes.push(clazz);
		this._renderClasses();
	}

	_renderClasses() {
		this.canvasElement.className = this.classes.join(' ');
	}

	_registerKeymap() {
		this.keyMap = {};
		window.addEventListener('keydown', (event) => {
			this.keyMap[event.key.toLowerCase()] = true;
			if(this.roundOver && event.key.toLowerCase() === 'r') {
				this.roundOver = false;
				this._reset();
				this.start();
			}
		});
		window.addEventListener('keyup', (event) => { this.keyMap[event.key.toLowerCase()] = false; });
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
		this.canvasElement = element;
	}

	_renderState() {
		this.stateDisplay.innerHTML = this.players.slice().sort((a, b) => a.points < b.points).map((player) => player.toStateString()).join('');
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
		this._clearTrails();
		this.players.forEach((player) => player.initPosition());
		this.itemManager.removeAll();
	}

	_clearTrails() {
		this.clearHitmap();
		this.options.drawContext.clearRect(0, 0, this.options.size[0], this.options.size[1]);
	}

	_spawnTick() {
		if(!this.ticksToNextSpawn) {
			this.ticksToNextSpawn = Math.round(Math.random() * this.options.maxTicksToNextItem);
			this.itemManager.spawn();
		}
		this.ticksToNextSpawn--;
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
		this._spawnTick();

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
			if(!player.dead) {
				player.points++;
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
