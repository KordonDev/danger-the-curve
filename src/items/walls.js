'use strict';

const Item = require('./Item');

class WallsItem extends Item {
	callback(index) {
		this.setForSelf(
			index,
			((player) => { player.options.openWalls = true; player.addClass('blink'); }),
			((player) => { player.options.openWalls = false; player.removeClass('blink'); }),
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
