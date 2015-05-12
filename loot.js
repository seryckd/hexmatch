// var loot = new LOOT()
// loot.add("name", weight);
// loot.add("name", weight);
// var name = loot.pick()      

function LOOT() {
	// array of items (name, weight, start, end)
	this.items = [];
	this.total = 0;
};

LOOT.prototype.add = function(name, weight) {
	this.items.push(
		{name:name, weight:weight, start:this.total, end:this.total+weight}
	);
	this.total += weight;
};

LOOT.prototype.pick = function() {
	var r = Math.round(Math.random() * this.total);
	
	var result = null;
	
	this.items.some(function(entry) {
				
		if (r >= entry.start && r <= entry.end) {
			result = entry.name;
			return true;
		}
	});
	
	return result;
};
