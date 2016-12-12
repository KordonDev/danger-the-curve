'use strict';

const Item = require('./Item');

class BoldItem extends Item {
	callback(index) {
		this.setForOthers(
			index,
			((player) => player.setRadius(player.options.radius + 2)),
			((player) => player.setRadius(player.options.radius - 2)),
			10000
		);
	}

	createElement() {
		super.createElement();
		this.element.innerHTML = 'B';
	}
}

module.exports = BoldItem;
