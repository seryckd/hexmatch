/*jslint devel: true*/
"use strict";
// var loot = new LOOT()
// loot.add("name", weight);
// loot.add("name", weight);
// var name = loot.pick()      

function LOOT() {
   // array of items (name, weight, start, end)
   this.items = [];
   this.total = 0;
}

LOOT.prototype.add = function (name, weight) {
   this.items.push({
      name: name,
      weight: weight,
      start: this.total,
      end: this.total + weight
   });

   console.log('add ' + name + ' start:' + this.total + ' end:' + this.total + Number(weight));

   this.total += weight;
};

LOOT.prototype.pick = function () {
   var r = Math.round(Math.random() * this.total),
      result = null;

   this.items.some(function (entry) {

      if (r >= entry.start && r <= entry.end) {
         console.log(entry.name + ' r:' + r + ' start:' + entry.start + ' end:' + entry.end);
         result = entry.name;
         return true;
      }
   });

   return result;
};
