/*jslint browser: true, devel: true*/
/*globals HexData,HEX,IMAGE,SPRITE,LOOT,PARTICLE,PartGenCircle */
// TODO  - change so that g_loot and g_tiles makes sense
//			either use index or names

// http://www.jslint.com
// http://eslint.org

// ----------------------------------------------------------------------------

/** This script finds the real position of an element, 
 * so if you resize the page and run the script again, 
 * it points to the correct new position of the element.
 */
function position(el) {
   var pos;

   for (pos = [0, 0]; el; el = el.offsetParent) {
      pos[0] += el.offsetLeft - el.scrollLeft;
      pos[1] += el.offsetTop - el.scrollTop;
   }
   return pos;
}

// ----------------------------------------------------------------------------


// Need canvas so we can add listeners to it
//var canvas = document.createElement("canvas");
var canvas = document.getElementById('canvas');

console.log('canvas (creation) ' + window.innerWidth + ',' + window.innerHeight);

// if ctx is null then canvas is not supported
var ctx = canvas.getContext("2d");

// Must apply prototype before 'new HexData' in HEX.init()
HexData.prototype.image = "water";
HexData.prototype.setImage = function (i) {
   this.image = i;
};
HexData.prototype.getImage = function () {
   return this.image;
};

// display coords x,y
HexData.prototype.dcoords = {};
HexData.prototype.setDisplayCoords = function (xycoords) {
   this.dcoords = xycoords;
};
HexData.prototype.blockeddirection = -1;

var g_info = {
   hexWidth: 55,
   hexHeight: 64,
   hexSmallWidth: 55 * 0.5,
   hexSmallHeight: 64 * 0.5,

   highestOrder: 0
};

HEX.init(
   1, // x display offset from canvas corner
   50, // y display offset from canvas corner
   10, // width of grid
   8, // height of grid
   54, // width of hex (slightly smaller than actual width so they overlap)
   62 // height of hex (slightly smaller than actual height so they overlap)
);
HEX.removeRandom(2);
HEX.each(function (hex) {
   hex.setDisplayCoords(hex.xycoords);
});

IMAGE.load("marker", "images/marker.gif");

SPRITE.load("hexes", "images/hextiles.png", [
   {
      name: "clay",
      height: 64,
      width: 55,
      x: 0,
      y: 0
   },
   {
      name: "water",
      height: 64,
      width: 55,
      x: 55,
      y: 0
   },
   {
      name: "wheat",
      height: 64,
      width: 55,
      x: 110,
      y: 0
   },
   {
      name: "ore",
      height: 64,
      width: 55,
      x: 165,
      y: 0
   },
   {
      name: "desert",
      height: 64,
      width: 55,
      x: 220,
      y: 0
   },
   {
      name: "sheep",
      height: 64,
      width: 55,
      x: 275,
      y: 0
   },
   {
      name: "wood",
      height: 64,
      width: 55,
      x: 330,
      y: 0
   },
   {
      name: "dead",
      height: 64,
      width: 55,
      x: 385,
      y: 0
   }
]);

SPRITE.load("twinkle", "images/twinkle.png", [
   {
      name: "1",
      height: 40,
      width: 40,
      x: 0,
      y: 0
   },
   {
      name: "2",
      height: 40,
      width: 40,
      x: 40,
      y: 0
   },
   {
      name: "3",
      height: 40,
      width: 40,
      x: 80,
      y: 0
   },
   {
      name: "4",
      height: 40,
      width: 40,
      x: 120,
      y: 0
   },
   {
      name: "5",
      height: 40,
      width: 40,
      x: 160,
      y: 0
   },
   {
      name: "6",
      height: 40,
      width: 40,
      x: 200,
      y: 0
   },

   {
      name: "7",
      height: 40,
      width: 40,
      x: 0,
      y: 40
   },
   {
      name: "8",
      height: 40,
      width: 40,
      x: 40,
      y: 40
   },
   {
      name: "9",
      height: 40,
      width: 40,
      x: 80,
      y: 40
   },
   {
      name: "10",
      height: 40,
      width: 40,
      x: 120,
      y: 40
   },
   {
      name: "11",
      height: 40,
      width: 40,
      x: 160,
      y: 40
   },
   {
      name: "12",
      height: 40,
      width: 40,
      x: 200,
      y: 40
   },

   {
      name: "13",
      height: 40,
      width: 40,
      x: 0,
      y: 80
   },
   {
      name: "14",
      height: 40,
      width: 40,
      x: 40,
      y: 80
   },
   {
      name: "15",
      height: 40,
      width: 40,
      x: 80,
      y: 80
   },
   {
      name: "16",
      height: 40,
      width: 40,
      x: 120,
      y: 80
   },
   {
      name: "17",
      height: 40,
      width: 40,
      x: 160,
      y: 80
   },
   {
      name: "18",
      height: 40,
      width: 40,
      x: 200,
      y: 80
   },

   {
      name: "19",
      height: 40,
      width: 40,
      x: 0,
      y: 120
   },
   {
      name: "20",
      height: 40,
      width: 40,
      x: 40,
      y: 120
   }
], [
   {
      name: "shine1",
      durationms: 100,
      spritenames: [
         "15", "14", "13",
         "12", "11", "10", "9", "8", "7",
         "7", "8", "9", "10", "11", "12",
         "13", "14", "15"
      ]
   }
]);

function drawHex(ctx, spritename, x, y) {

   var ref = SPRITE.sprite("hexes", spritename);

   ctx.drawImage(ref.image,
      ref.x, ref.y, ref.width, ref.height,
      x, y, ref.width, ref.height);
}

function drawSmallHex(ctx, spritename, x, y) {

   var ref = SPRITE.sprite("hexes", spritename);
   ctx.drawImage(ref.image,
      ref.x, ref.y, ref.width, ref.height,
      x, y, g_info.hexSmallWidth, g_info.hexSmallHeight);
}


var constants = {
   firstMatchLevel: 0,
   lastMatchLevel: 5
};

var g_loot = new LOOT();
g_loot.add(6, 1);
g_loot.add(0, 40);
g_loot.add(1, 30);

var g_highestMatchLevel = constants.firstMatchLevel;

var score = 0;

// 'level' index will match the first 6 tiles
var g_tiles = ["wheat", "sheep", "wood", "ore", "clay", "desert", "dead"];

// List of tiles that are coming next
//var g_tilepipe = [];
//g_tilepipe.push(g_loot.pick());
//g_tilepipe.push(g_loot.pick());
//g_tilepipe.push(g_loot.pick());

// TODO
//  init(x, y)
//  add(tile) - add a tile, increases size of pipe
//  peek() - returns the head of the pipe
//  next(tile) - removes the head and adds a new tile to the end
//  update()
//  render(ctx);
var g_tileQueue = (function () {

   var queue = [],
      origx = 0,
      origy = 0;

   return {

      init: function (x, y) {
         origx = x;
         origy = y;
      },

      add: function (tile) {
         console.log('add ' + tile);
         queue.push(tile);
      },

      peek: function () {
         return queue[0];
      },

      next: function (tile) {
         var head = queue.shift();
         this.add(tile);
         return head;
      },

      update: function () {},

      render: function (ctx) {
         var pipepos = 300;

         queue.forEach(function (val, idx, arr) {
            drawSmallHex(ctx, g_tiles[val], pipepos, 1);
            pipepos -= g_info.hexSmallWidth;
         });

         //TODO draw matching hex on first position
      }
   };
}());

g_tileQueue.add(g_loot.pick());
g_tileQueue.add(g_loot.pick());
g_tileQueue.add(g_loot.pick());
g_tileQueue.add(g_loot.pick());

// The current tile (references g_tiles)
var g_currenttile = constants.firstMatchLevel;

var shineanim = null;
var particles = new PARTICLE();


// consider
// Given a starting tile, look for all tiles up to 2 hops away that
// match the given order
// [I] hex		starting tile
// [I] matchLevel	matching type
// [O] sels		array of tiles
function consider(hex, matchLevel, sels) {

   if (matchLevel > constants.lastMatchLevel) {
      return;
   }

   // consider all hexes on the 1st ring out
   HEX.neighbours(hex, function (n1, direct) {
      if (n1.getImage() === g_tiles[matchLevel]) {
         sels.push(n1);

         // now look at the joining neigbours on the 2nd ring out
         HEX.neighbours(n1, function (n2, direct) {
            if (n2.getImage() === g_tiles[matchLevel]) {
               sels.push(n2);
            }
         }, direct);
      }
   });
}

// setTile
// Sets a tile to a new matchLevel.  If the surrounding tiles make a match then
// the matchLevel of the tile will be increased.
// [I] hex:		tile to be set
// [O] matches:	array of other tiles that make up the match (length may be 0)
// [I/O] matchLevel:	input is the original matchLevel of the tile, output
//				is the actual matchLevel the tile was set to.
//				Output is only set if matches.length > 0
function setTile(hex, matches, matchLevel) {

   var sels;

   // what happens when at highest matchLevel ?
   do {
      sels = [];
      consider(hex, matchLevel, sels);

      if (sels.length >= 2) {
         matchLevel += 1;
         sels.forEach(function (entry) {
            matches.push(entry);
         });
      }
   } while (sels.length >= 2 && matchLevel < constants.lastMatchLevel);

   return matchLevel;
}


// Keeps track of the current tile and any other tiles that form the match.
// This is used to show the match that could be made if the current tile was set.
var possible = {
   hex: null,
   matchLevel: 0,
   matches: [],

   // Removes the current match.  Also resets the matching tiles display
   // coordinates in case they were in the middle of an animation
   clear: function () {

      var i, hex, len;

      for (i = 0, len = this.matches.length; i < len; i += 1) {
         hex = this.matches[i];
         hex.setDisplayCoords(hex.xycoords);
      }

      this.hex = null;
      this.matches = [];
   },

   // [I] hex:		new current tile
   // [I] ord:		original order (may be changed if other tiles match)
   set: function (hex, matchLevel) {
      this.clear();
      this.hex = hex;
      this.matchLevel = setTile(hex, this.matches, matchLevel);
   }
};


// Track the mouse and apply the next tile to the tile the mouse is over
canvas.addEventListener("mousemove", function (e) {

   // clientX, clientY in local (DOM content) coords
   // screenX, screenY in global (screen) coords

   var offset = position(canvas),

      // clientX, clientY are Browser Window coords, (0,0) is top left
      // offsetLeft, offsetTop are window coords of the canvas

      mx = e.clientX - offset[0],
      my = e.clientY - offset[1],

      // identify which hexagon
      hex = HEX.select(mx, my);

   if (hex !== null) {
      if (hex.getImage() !== "water") {
         possible.clear();
         return;
      }

      possible.set(hex, g_currenttile);
   }
});

// mouse click
canvas.addEventListener("click", function (e) {
   // clientX, clientY are Browser Window coords, (0,0) is top left
   // offsetLeft, offsetTop are window coords of the canvas

   var offset = position(canvas),
      mx = e.clientX - offset[0],
      my = e.clientY - offset[1],
      hex,
      matches,
      matchLevel;

   // particle explosion!
   particles.add(mx, my, {
      type: PartGenCircle.prototype,
      number: 10,
      numRings: 0
   });

   // identify which hexagon
   hex = HEX.select(mx, my);

   if (hex !== null) {

      if (hex.getImage() !== "water") {
         return;
      }

      possible.clear();

      matches = [];
      matchLevel = setTile(hex, matches, g_currenttile);

      if (matchLevel > g_highestMatchLevel) {
         g_highestMatchLevel = matchLevel;
         g_loot.add(matchLevel, 10);
      }

      hex.setImage(g_tiles[matchLevel]);

      // scoring system
      // 10 points per tile * order/level
      score += ((matchLevel + 1) * 100);

      // plus additional points for every extra tile used
      if (matches.length > 2) {
         score += ((matches.length - 2) * 100);
      }

      // remove the next tile and replace with another one
      g_currenttile = g_tileQueue.next(g_loot.pick());

      // Add a new tile to the end of the pipe
      //    g_tilepipe.push(g_loot.pick());

      matches.forEach(function (entry) {
         entry.setImage("water");
      });

      if (matches.length > 0) {
         // TODO try out removing hex, didn't like
         //			HEX.remove(hex);

         // particle explosion!
         particles.add(hex.centercoords.x, hex.centercoords.y, {
            type: PartGenCircle.prototype,
            number: 10,
            numRings: matchLevel - 1
         });
      }
   }
}, false);

// interval in ms
function update(interval) {

   // static variable on the current function
   if (typeof this.counter === 'undefined') {
      this.counter = 0;
   }


   this.counter += interval;

   console.log('counter:' + this.counter);

   var isUpdate = false;

   if (this.counter > 250) {
      this.counter = 0;
      isUpdate = true;
   }

   if (possible.hex !== null && isUpdate) {

      possible.matches.forEach(function (hex) {

         var directions = [{
               x: 0,
               y: -1
            }, {
               x: 1,
               y: -1
            }, {
               x: 1,
               y: 0
            }, {
               x: 1,
               y: 1
            }, {
               x: 0,
               y: 1
            }, {
               x: -1,
               y: 1
            }, {
               x: -1,
               y: 0
            }, {
               x: -1,
               y: -1
            }],

            x,
            y,
            of,
            direction,
            dcoords;

         do {
            direction = hex.blockeddirection;

            do {
               direction = Math.round(Math.random() * 7);
            } while (hex.blockeddirection === direction);

            of = directions[direction];

            dcoords = hex.dcoords;
            x = dcoords.x + of.x;
            y = dcoords.y + of.y;

            // set the blocked direction to be the opposite of the last direction taken
            // hex.blockeddirection = direction > 3 ? direction - 4 : direction + 4;
            // doesn't seem to make a difference so just stop twice in the same direction
            hex.blockeddirection = direction;

            // Do not stray more than 2 pixels away from the original centre
         } while (Math.abs(hex.xycoords.x - x) > 2 || Math.abs(hex.xycoords.y - y) > 2);

         hex.setDisplayCoords({
            x: x,
            y: y
         });

      });
   }

   if (shineanim !== null) {
      shineanim.update(interval);
   }

   // supply a bounding rectangle to keep all the particles in
   particles.update(interval, {
      width: canvas.width,
      height: canvas.height
   });
}


var render = function () {
   var digitWidth, sscore, spos, count, match, ref, xoffset, yoffset;

   ctx.clearRect(0, 0, canvas.width, canvas.height);

   HEX.each(function (hex) {
      drawHex(ctx, hex.getImage(), hex.dcoords.x, hex.dcoords.y);
   });

   if (possible.hex !== null) {

      match = false;

      possible.matches.forEach(function (hex) {
         drawHex(ctx, hex.getImage(), hex.dcoords.x, hex.dcoords.y);
         match = true;
      });

      drawHex(ctx, g_tiles[possible.matchLevel],
         possible.hex.dcoords.x, possible.hex.dcoords.y);

      ctx.drawImage(
         IMAGE.image("marker"),
         possible.hex.dcoords.x,
         possible.hex.dcoords.y
      );

      if (match) {
         if (shineanim === null) {
            shineanim = SPRITE.animation("twinkle", "shine1");
         }

         ref = shineanim.sprite();
         xoffset = (HEX.hexWidth() - ref.width) / 3;
         yoffset = (HEX.hexHeight() - ref.height) / 3;
         ctx.drawImage(ref.image,
            ref.x, ref.y, ref.width, ref.height,
            possible.hex.dcoords.x + xoffset, possible.hex.dcoords.y + yoffset, ref.width, ref.height);
      } else {
         shineanim = null;
      }
   }

   // ------------------------------------------------------------------------
   // Status Bar

   // ------------------------
   // Pipe

   //TODO need to indicate pipe needs to be slid

   // 1 2 3 4
   // 1 2 3
   //  1 2 3
   //   1 2 3
   // n 1 2 3

   g_tileQueue.render(ctx);

   //	var pipepos = 300;
   //	drawSmallHex(ctx, g_tiles[g_currenttile], pipepos, 1);

   //TODO draw hex on the small hex

   //	g_tilepipe.forEach(function(val, idx, arr) {
   //		pipepos -= g_info.hexSmallWidth;
   //		drawSmallHex(ctx, g_tiles[val], pipepos, 1);
   //	});


   // ------------------------
   // Score

   ctx.font = "20px Times New Roman";
   ctx.fillStyle = "Black";

   digitWidth = 10;
   sscore = score.toString();
   spos = canvas.width - 1.5 * digitWidth;
   for (count = sscore.length - 1; count >= 0; count -= 1) {
      ctx.fillText(sscore.charAt(count), spos, 30);
      spos -= digitWidth;
   }
   // ------------------------

   // Particles last, as they draw over everything else
   particles.render(ctx);
};


var main = function () {

   var now,
      delta;

   try {
      if (!IMAGE.isReady()) {
         return;
      }

      now = Date.now();
      delta = now - this.then;

      console.log('delta:' + delta);

      update(delta);
      render();

      this.then = now;

   } catch (e) {
      console.log('caught ' + e);
      console.log('at ' + e.stack);
   }
};

// Canvas comprises
// Top Status Bar
// main canvas

canvas.width = HEX.boundingRect().width;
canvas.height = HEX.boundingRect().height + 50;

//document.body.appendChild(canvas);

console.log('canvas (set) ' + canvas.width + ',' + canvas.height);

var then = Date.now();
// 20ms is playable
// 10ms, 1ms causes constant CPU
setInterval(main, 20);
