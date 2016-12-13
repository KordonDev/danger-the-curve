'use strict';

class Item {
	constructor(game) {
		this.game = game;
		this.x = Math.random() * this.game.options.size[0];
		this.y = Math.random() * this.game.options.size[1];
	}

	callback() {
		throw new Error('has to be implemented in subclass');
	}

	getSize() {
		return 15;
	}

	reset() {
		if(this.toInvokeLater) {
		console.log(this.toInvokeLater);
			window.clearTimeout(this.toInvokeLater);
			this.toInvokeLaterCallback();
			this.toInvokeLater = undefined;
		}
	}

	_setAndReset(index, fn, resetFn, time, forSelf) {
		this.game.players.forEach((player) => {
			if((forSelf && player.index === index) || (!forSelf && player.index !== index)) {
				fn(player);
			}
		});
		this.toInvokeLaterCallback = (() => {
			this.game.players.forEach((player) => {
				if((forSelf && player.index === index) || (!forSelf && player.index !== index)) {
					resetFn(player);
				}
			});
			this.toInvokeLater = undefined;
		}).bind(this);
		this.toInvokeLater = setTimeout(this.toInvokeLaterCallback, time);
	}

	setForOthers(index, fn, resetFn, time) {
		this._setAndReset(index, fn, resetFn, time, false);
	}

	setForSelf(index, fn, resetFn, time) {
		this._setAndReset(index, fn, resetFn, time, true);
	}

	createElement() {
		const element = document.createElement('div');
		element.className = 'item';
		this.element = element;
		element.style.left = (this.x - this.getSize()) + 'px';
		element.style.top = (this.y - this.getSize()) + 'px';
		this.game.options.container.appendChild(element);
	}

}

module.exports = Item;
