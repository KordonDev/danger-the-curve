'use strict';

const SPAWN_PADDING = 100;

class Player {
	constructor(options, gameState, index) {
		this.options = options;
		this.game = gameState;
		this.index = index;
		this.points = 0;
		this.classes = (this.options.classes ? this.options.classes : []).concat(['player']);

		this.initPosition();

		this._registerPlayerElement();
	}

	initPosition() {
		this.position = [this._getRandomValue(this.game.options.size[0] - SPAWN_PADDING * 2) + SPAWN_PADDING, this._getRandomValue(this.game.options.size[1] - SPAWN_PADDING * 2) + SPAWN_PADDING];
		this.vec = this._rotate([1, 0], Math.random() * Math.PI);

		this.normVec = this._rotate(this.vec, 1.5708);
		this.stateCounter = 0;
		this.isGap = false;
		this.controlled = true;
		this.dead = false;
	}

	removeClass(clazz) {
		this.classes.splice(this.classes.indexOf(clazz), 1);
		this._renderClasses();
	}

	addClass(clazz) {
		this.classes.push(clazz);
		this._renderClasses();
	}

	_renderClasses() {
		this.playerElement.className = this.classes.join(' ');
	}

	_registerPlayerElement() {
		const element = document.createElement('div');
		element.style.height = this.options.radius * 2 + 'px';
		element.style.width = this.options.radius * 2 + 'px';
		element.style.backgroundColor = this.options.color;
		this.game.options.container.appendChild(element);
		this.playerElement = element;
		this._renderClasses();
	}

	setRadius(r) {
		this.options.radius = r;
		this.playerElement.style.height = this.options.radius * 2 + 'px';
		this.playerElement.style.width = this.options.radius * 2 + 'px';
	}

	toStateString() {
		return 'Player ' + (this.options.name ? this.options.name : this.index) + (this.dead ? ' (dead)'  : '') + ': ' + this.points + '<br />';
	}

	_getRandomValue(max) {
		return Math.floor(Math.random() * max);
	}

	_rotate(vec, rad) {
		return [Math.cos(rad) * vec[0] - Math.sin(rad) * vec[1], Math.sin(rad) * vec[0] + Math.cos(rad) * vec[1]];
	}

	_posPlusVec(a, vec) {
		return [
			this.position[0] + a * vec[0],
			this.position[1] + a * vec[1]
		];
	}

	_posPlusVecVec(a, vec1, b, vec2) {
		return [
			this.position[0] + a * vec1[0] + b * vec2[0],
			this.position[1] + a * vec1[1] + b * vec2[1],
		];
	}

	tick(steps) {
		steps = steps * this.options.speed;
		const parts = Math.ceil(steps);
		const stepsPerPart = steps / parts;
		for(let i = 0; i < parts; i++) {
			this._physics(stepsPerPart);
			this._paint();
		}
	}

	_physics(elapsedSteps) {
		this.stateCounter += elapsedSteps;
		if(this.isGap && this.stateCounter > this.options.gapLength) {
			this.stateCounter = 0;
			this.isGap = false;
		}
		if(!this.isGap && this.stateCounter > this.options.noGapLength) {
			this.stateCounter = 0;
			this.isGap = true;
		}
		//update position
		this.position = this._posPlusVec(elapsedSteps, this.vec);

		//collisions
		if(!this.dead) {
			this._collide();
		}

		//update hitmap
		if(!this.isGap) {
			this._updateHitmap();
		}


		//update controlls
		if(this.options.controlled) {
			if(this.game.keyMap[this.options.controls[1]]) {
				this.vec = this._rotate(this.vec, this.options.steering);
				this.normVec = this._rotate(this.normVec, this.options.steering);
			}
			if(this.game.keyMap[this.options.controls[0]]) {
				this.vec = this._rotate(this.vec, -this.options.steering);
				this.normVec = this._rotate(this.normVec, -this.options.steering);
			}
		}
	}

	_collide() {
		const nextCoord = this._posPlusVec(this.options.radius + 1, this.vec);
		const nextCoordLeft = this._posPlusVec(this.options.radius + 1, this.normVec);
		const nextCoordRight = this._posPlusVec(-this.options.radius - 1, this.normVec);
		if(this.game.getHitmap(nextCoord) || this.game.getHitmap(nextCoordLeft) || this.game.getHitmap(nextCoordRight)) {
			this._die();
		}
		if(!this.game.options.openWalls && !this.options.openWalls) {
			if(this.position[0] < this.options.radius) {
				this._die();
			} else if(this.position[0] > this.game.options.size[0] - this.options.radius) {
				this._die();
			} else if(this.position[1] < this.options.radius) {
				this._die();
			} else if(this.position[1] > this.game.options.size[1] - this.options.radius) {
				this._die();
			}
		} else {
			if(this.position[0] < 0) {
				this.position[0] = this.game.options.size[0];
			} else if(this.position[0] > this.game.options.size[0]) {
				this.position[0] = 0;
			} else if(this.position[1] < 0) {
				this.position[1] = this.game.options.size[1];
			} else if(this.position[1] > this.game.options.size[1]) {
				this.position[1] = 0;
			}
		}

		if(!this.dead) {
			this.game.itemManager.collide(this);
		}
	}

	_die() {
		this.controlled = false;
		this.dead = true;
		this.vec = [0, 0];
		this.game.playerDied(this.index);
	}

	_paint() {
		if(!this.isGap) {
			const ctx = this.game.options.drawContext;
			ctx.strokeStyle = this.options.color;
			ctx.beginPath();
			ctx.arc(this.position[0], this.position[1], this.options.radius, 0, 2 * Math.PI, false);
			ctx.fillStyle = this.options.color;
			ctx.fill();
		}
		this.playerElement.style.transform = 'translate(' + (this.position[0] - this.options.radius) + 'px' + ',' + (this.position[1] - this.options.radius) + 'px)';
	}


	_updateHitmap() {
		this.game.setHitmap(this._posPlusVecVec(-1, this.vec, -this.options.radius, this.normVec), this.index);
		this.game.setHitmap(this.position, this.index);
		this.game.setHitmap(this._posPlusVecVec(-1, this.vec, this.options.radius, this.normVec), this.index);
	}

}

module.exports = Player;
