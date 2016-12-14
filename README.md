# Danger the curve

This is a small and simple clone of www.achtungdiekurve.net or www.achtung-die-kurve.com or curvefever.com.

To play it online: https://rawgit.com/flash1293/danger-the-curve/master/index.html

## Config

Before starting the game you have to place a JSON-config into the given text-area.

The following options exist for players:
- controls: Array of two keys (as string) which control left and right
- color: string of html-color defining trail and player color
- controlled: boolean whether the keyboard controls this player
- radius: size in px of the player and the trail
- steering: Amount of how big curves can be taken
- speed: speed of the player (1 is approx. 60px per second)
- gapLength: Length in px of gaps in the trail
- noGapLength: Length in px of trail between gaps
- name: name as string of the player
- classes: array of string for css classes set for a player
- openWalls: boolean whether the player can pass through the walls

The following items exist:
- bold: Other players get bigger
- fast: Own player gets faster
- switch: Other players controls are reversed
- clear: Clears screen
- walls: Own player can pass through walls
- allWalls: All players can pass through walls
- zombie: Own player controlls all players

The following world-options exist:
- openWalls: boolean whether players can pass through walls by default
