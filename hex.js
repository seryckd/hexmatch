/*jslint nomen: true*/

/* HEX Module
 *
 * columns are denoted by 'q', number of columns is width
 * rows are denoted by 'r', number of rows is height
 *
 * 
 * Axial Coordinates
 * (q, r)
 * Where column is the top left to bottom right diagonal and row is horizontal.
 * This system will lead to negative indexes. 
 *
 * (0,0) (1,0) (2,0)         Width is 3 
 *    (0, 1) (1,1)           Height is 4
 * (-1,2) (0,2) (1,2)
 *     (-1,3) (0,3)
 *
 * Cube Coordinates
 * (x, y, z) 
 * Where x + y + z = 0
 *
 *
 */

"use strict";

// Object that is stored for each hex 
var HexData = function (q, r) {
   this.axial = {
      q: q,
      r: r
   };

   // x,y
   this.xycoords = {};
   this.centercoords = {};

   this.getHash = function () {
      //TODO shouldn't be a duplicate of HEX.hash
      return this.axial.q + "_" + this.axial.r;
   };
};

var HEX = (function () {

   var xyoffset = {
         x: 0,
         y: 0
      },

      numrow = 0, // width - number in row (x) - every other row has 1 less
      numcol = 0, // height - number in column (y)

      hexSize = 0, // size/radius of hex (calculated from height)
      hexHeight = 0,
      hexWidth = 0,
      /* { q:, r: }
       */
      hexes = {},

      hash = function (q, r) {
         return q + "_" + r;
      },

      // returns HexData or null
      getHex = function (q, r) {
         var h = hexes[hash(q, r)];

         if (h === undefined) {
            h = null;
         }

         return h;
      },

      // axial coords neighbours

      directions = [
         {
            q: 1,
            r: 0
         }, // direction 0
         {
            q: 1,
            r: -1
         }, {
            q: 0,
            r: -1
         }, {
            q: -1,
            r: 0
         }, {
            q: -1,
            r: 1
         }, {
            q: 0,
            r: 1
         } // direction 5
      ],

      xycoords = function (q, r) {

         var x = Math.floor(hexSize * Math.sqrt(3) * (q + r / 2)),
            y = Math.floor(hexSize * 3 / 2 * r);

         return {
            x: x + xyoffset.x,
            y: y + xyoffset.y
         };
      },

      nextDirection = function (direct) {
         direct += 1;
         if (direct > 5) {
            return 0;
         }
         return direct;
      },

      prevDirection = function (direct) {
         direct -= 1;
         if (direct < 0) {
            return 5;
         }
         return direct;
      };

   /*
     cube_to_axial = function(cube) {
       return {
         q : cube.x,
         r : cube.z
       }
     };

     axial_to_cube = function(axial) {
       var x = axial.q;
       var z = axial.r;
       return {
         x: x,
         z: z,
         y: -x-z
       }
     }

     hex_round = function(cube) {
       var rx = Math.round(cube.x);
       var ry = Math.round(cube.y);
       var rz = Math.round(cube.z);
          
       if (rx + ry + rz != 0) {
         var xdiff = Math.abs(rx - cube.x);
         var ydiff = Math.abs(ry - cube.y);
         var zdiff = Math.abs(rz - cube.z);

         if (xdiff > ydiff && xdiff > zdiff)
           rx = -ry-rz;
         else if (ydiff > zdiff)
           ry = -rx-rz;
         else
           rz = -rx-ry;
       }

       return {
         x: rx,
         y: ry,
         z: rz
         }
     }
   */
   return {

      // dx		display pixel offset in x direction
      // dy		display pixel offset in y direction
      // width of grid (num cols)
      // height of grid (num rows)
      // width of hex in pixels
      // height of hex in pixels
      init: function (dx, dy, numcol_, numrow_, width, height) {

         var r, numcols, col, q, hex;

         xyoffset.x = dx;
         xyoffset.y = dy;

         numcol = numcol_;
         numrow = numrow_;

         hexHeight = height;
         hexWidth = width;
         hexSize = hexHeight / 2;

         // setup the hexes
         for (r = 0; r < numrow; r += 1) {
            numcols = (r % 2) ? numcol - 1 : numcol;
            for (col = 0; col < numcols; col += 1) {
               q = -Math.floor(r / 2) + col;
               hex = new HexData(q, r);
               hex.xycoords = xycoords(q, r);
               hex.centercoords.x = hex.xycoords.x + hexWidth / 2;
               hex.centercoords.y = hex.xycoords.y + hexHeight / 2;

               hexes[hash(q, r)] = hex;
            }
         }
      },

      // Return the height of the hex image
      hexHeight: function () {
         return hexHeight;
      },

      // Return the width of the hex image
      hexWidth: function () {
         return hexHeight;
      },

      // Remove random tiles from the grid
      // Params
      //   num	number of tiles to remove
      removeRandom: function (num) {
         if (num === null || num < 1) {
            num = 1;
         }

         while (num > 0) {
            var q = Math.round(Math.random() * (numcol - 1)),
               r = Math.round(Math.random() * (numrow - 1));

            if (hexes[hash(q, r)] !== undefined) {
               delete hexes[hash(q, r)];
               num = -1;
            }
         }
      },

      // Removes the given hex tile from the grid
      // Params
      //	hex	HexData
      remove: function (hex) {
         delete hexes[hex.getHash()];
      },

      // Returns the rectangular size in pixels needed to bound the
      // hex grid
      //  Return
      //    { width:?, height:? }
      boundingRect: function () {
         var halfHexSize = hexSize / 2;
         return {
            width: numcol * hexWidth,
            height: Math.round(numrow * (hexSize + halfHexSize) + halfHexSize) + 2
         };
      },

      /*
       *  Loop around the hexes and apply the function to each
       *  Function signature: (HexData)
       */
      each: function (apply) {

         var key, hex;

         for (key in hexes) {
            hex = hexes[key];
            apply(hex);
         }
      },

      // apply a function (apply) to each of the neighbours of the
      // given hex in the given direction.
      // if direction is undefined/null then all directions are used.
      // if direction is specified then the 3 directions on the second ring
      //   of hexes that touch the given hex are used.
      // function signature:  apply(HexData, direction)
      neighbours: function (hex, apply, direct) {
         var total, count = 0, newq, newr, next;

         if (direct === undefined) {
            // all directions, 0-5
            direct = 0;
            total = 6;
         } else {
            // 3 directions starting from direction-1
            // using modulo 6
            direct = prevDirection(direct);
            total = 3;
         }

         while (count < total) {
            newq = hex.axial.q + directions[direct].q;
            newr = hex.axial.r + directions[direct].r;
            next = getHex(newq, newr);

            if (next !== null) {
               apply(next, direct);
            }

            direct = nextDirection(direct);
            count += 1;
         }
      },

      // mouse coords to HexData object
      // return HexData object or null
      select: function (x, y) {
         /*
		var aproxq = (1/3*Math.sqrt(3) * x - 1/3 * y) / hexSize;
		var aproxr = 2/3 * y / hexSize;

		var cube = axial_to_cube({q:aproxq, r:aproxr});

		var cube2 = hex_round(cube);

		return cube_to_axial(cube2);
     */

         x = x - xyoffset.x;
         y = y - xyoffset.y;

         // weird magic algorithm
         // http://www.redblobgames.com/grids/hexagons

         var x1 = (x - (hexWidth / 2)) / hexWidth,
            t1 = y / hexSize,
            t2 = Math.floor(x1 + t1),
            r = Math.floor((Math.floor(t1 - x1) + t2) / 3),
            q = Math.floor((Math.floor(2 * x1 + 1) + t2) / 3) - r,
             hex = hexes[hash(q,r)];

         if (hex === undefined) {
            hex = null;
         }

         return hex;
      }

   };
}());
