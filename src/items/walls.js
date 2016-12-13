'use strict';

const Item = require('./Item');

class WallsItem extends Item {
	callback(index) {
		this.setForSelf(
			index,
			((player) => player.options.openWalls = true),
			((player) => player.options.openWalls = false),
			10000
		);
	}

	createElement() {
		super.createElement();
		this.element.innerHTML = 'W';
		this.element.className = 'item item-own';
	}
}

module.exports = WallsItem;
