'use strict';

const ITEM_SIZE = 15;

class ItemManager {
	constructor(items, gameState) {
		this.items = items;
		this.game = gameState;
		this.spawnedItems = [];
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
		const item = {
			x: Math.random() * this.game.options.size[0],
			y: Math.random() * this.game.options.size[1],
			name: name
		};
		switch(name) {
			case 'bold':
				item.callback = ((index) => {
					this.game.players.forEach((player) => {
						if(player.index !== index) {
							player.options.radius += 2;
						}
					});
					setTimeout(() => {
						this.game.players.forEach((player) => {
							if(player.index !== index) {
								player.options.radius -= 2;
							}
						});
					}, 10000);
				});
				break;
			case 'fast':
				item.callback = ((index) => {
					this.game.players.forEach((player) => {
						if(player.index === index) {
							player.options.speed += 1;
						}
					});
					setTimeout(() => {
						this.game.players.forEach((player) => {
							if(player.index === index) {
								player.options.speed -= 1;
							}
						});
					}, 10000);
				});
				break;
		}
		this._addItem(item);
	}

	_addItem(item) {
		const element = document.createElement('div');
		element.className = 'item';
		item.element = element;
		element.style.left = (item.x - ITEM_SIZE) + 'px';
		element.style.top = (item.y - ITEM_SIZE) + 'px';
		element.innerHTML = item.name.charAt(0);
		this.game.options.container.appendChild(element);
		this.spawnedItems.push(item);
	}

	collide(player) {
		const items = this.spawnedItems;
		for(let i = 0; i < items.length; i++) {
			const item = items[i];
			const distance = Math.sqrt(Math.pow(item.x - player.position[0], 2) + Math.pow(item.y - player.position[1], 2));
			if(distance < ITEM_SIZE) {
				item.callback(player.index);
				this.remove(i);
			}

		}
	}

	remove(index) {
		this.spawnedItems[index].element.remove();	
		this.spawnedItems.splice(index, 1);
	}
}


module.exports = ItemManager;
