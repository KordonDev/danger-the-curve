'use strict';

const Item = require('./Item');

class FastItem extends Item {
	callback(index) {
		this.setForSelf(
			index,
			((player) => player.options.speed += 1),
			((player) => player.options.speed -= 1),
			10000
		);
	}

	createElement() {
		super.createElement();
		this.element.innerHTML = 'F';
		this.element.className = 'item item-own';
	}
}

module.exports = FastItem;
