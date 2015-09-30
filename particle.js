// Ideas for particles
//
//  -- animation
//  -- decay over time, die before getting to the bounding rect
//  -- use transparency to indicate decay
//  -- colour cycle
//  -- non-linear trajectories
//  --    spiralling
//  --    different rings to be offset by a few degrees


// var particles = new PARTICLE();
// particles.add(params);
// particles.update(interval, boundingrect);
// particles.render(ctx);

// PARTICLE
//   ParticleGenerator[]
//		Particle[]

// extend
//  add() to take an object, including name of generator

function Particle(x, y) {
	this.posx = x;
	this.posy = y;
	this.elapsedms = 0;
	this.startx = x;
	this.starty = y;
	
	this.attrs = {}
};

Particle.prototype.setAttr = function(name, value) {
	this.attrs[name] = value;
};

Particle.prototype.getAttr = function(name) {
	return this.attrs[name];
};


// ----------------------------------------------------------------------------
// PARTICLE
//

function PARTICLE() {
	this.generators = [];
};

PARTICLE.prototype.add = function(x, y, attrs) {
	if (typeof x == NaN || typeof y == NaN) {
		console.log('failed to PARTICLE.add(' + x + ',' + y);
		return;
	}
	
	var genproto = attrs.type;
		
	//TODO how to create object with prototype and arguments
	var generator = new genproto.constructor();
	generator.init(x, y, attrs);
	
	this.generators.push(generator);
};

PARTICLE.prototype.update = function(intervalms, boundingrect) {
	this.generators.filter(function(p, index, filter) {
		return p.update(intervalms, boundingrect);
	});
};

PARTICLE.prototype.render = function(ctx) {
	this.generators.forEach(function(g, index, gs) {
		g.render(ctx);
	});
};


