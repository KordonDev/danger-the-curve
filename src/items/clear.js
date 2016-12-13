'use strict';

const Item = require('./Item');

class ClearItem extends Item {
	callback(index) {
		this.game._clearTrails();
	}

	createElement() {
		super.createElement();
		this.element.innerHTML = 'C';
		this.element.className = 'item item-neutral';
	}
}

module.exports = ClearItem;
