'use strict';

const items = require('./items/index');

class ItemManager {
	constructor(items, gameState) {
		this.items = items;
		this.game = gameState;
		this.spawnedItems = [];
		this.usedItems = [];
	}

	spawn() {
		for(let i = 0; i < this.items.length; i++) {
			const currentItem = this.items[i];
			if(Math.random() < currentItem.spawnRate) {
				this.spawnItem(currentItem.name);
			}
		}
	}

	spawnItem(name) {
		const item = new items[name](this.game);
		item.createElement();
		this.spawnedItems.push(item);
	}

	collide(player) {
		const items = this.spawnedItems;
		for(let i = 0; i < items.length; i++) {
			const item = items[i];
			const distance = Math.sqrt(Math.pow(item.x - player.position[0], 2) + Math.pow(item.y - player.position[1], 2));
			if(distance - player.options.radius < item.getSize()) {
				item.callback(player.index);
				this.remove(i);
			}

		}
	}

	remove(index) {
		const currentItem = this.spawnedItems[index];
		currentItem.element.remove();	
		this.usedItems.push(this.spawnedItems.splice(index, 1)[0]);
	}


	removeAll() {
		for(let i = this.spawnedItems.length; i > 0; i--) {
			this.remove(0);
		}
		for(let i = this.usedItems.length; i > 0; i--) {
			this.usedItems[0].reset();
			this.usedItems.splice(0, 1);
		}
	}
}


module.exports = ItemManager;
