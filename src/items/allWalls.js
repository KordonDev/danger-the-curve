'use strict';

const Item = require('./Item');

class ClearItem extends Item {
	callback(index) {
		if(!this.game.options.openWalls) {
			this.setForSelf(
				index,
				(() => { this.game.options.openWalls = true; this.game.addClass('blink-borders');  }),
				(() => { this.game.options.openWalls = false; this.game.removeClass('blink-borders');  }),
				10000
			);
		}
	}

	createElement() {
		super.createElement();
		this.element.innerHTML = 'W';
		this.element.className = 'item item-neutral';
	}
}

module.exports = ClearItem;
