'use strict';

const Item = require('./Item');

class SwitchItem extends Item {
	callback(index) {
		this.setForOthers(
			index,
			((player) => { player.options.steering *= -1;}),
			((player) => { player.options.steering *= -1;}),
			10000
		);
	}

	createElement() {
		super.createElement();
		this.element.innerHTML = 'S';
		this.element.className = 'item';
	}
}

module.exports = SwitchItem;
