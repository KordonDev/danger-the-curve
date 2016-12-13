'use strict';

const Item = require('./Item');

class ZombieItem extends Item {
	callback(index) {
		const ownPlayer = this.game.players[index - 1];
		const oldControls = this.game.players.map((player) => player.options.controls);
		this.setForOthers(
			index,
			((player) => player.options.controls = ownPlayer.options.controls ),
			((player) => player.options.controls = oldControls[player.index - 1]),
			10000
		);
	}

	createElement() {
		super.createElement();
		this.element.innerHTML = 'Z';
	}
}

module.exports = ZombieItem;
