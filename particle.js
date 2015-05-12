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

function Particle(x, y, vector) {
	this.posx = x;
	this.posy = y;
	this.velocity = 600;
	this.vector = vector;
	this.colour = { red:255, green:0, blue:0 };	
	this.elapsedms = 0;
};

// ----------------------------------------------------------------------------
// ParticleGenerator

function ParticleGenerator(origx, origy, attrs) {	
	this.particles = [];

	this.origx = origx;
	this.origy = origy;
	this.time = 0;
	this.attrs = attrs;
		
	this.generate();
};

ParticleGenerator.prototype.getAttr = function(field, defvalue) {
	var val = this.attrs[field];

//	console.log('getAttr ' + field +'=' + val);
	
	return typeof val == 'undefined' ? defvalue : val;
};

ParticleGenerator.prototype.generate = function() {

	var number = this.getAttr("number", 10);

	var angle = 2*Math.PI/number;			

	for(var count=0; count<number; ++count) {			

		var thisangle = angle * count;

		// adjust each angle by a random amount								
	//				var diff = Math.round(Math.random() * angle);
	//				thisangle += diff;				
	
		var x = Math.cos(thisangle);
		var y = Math.sin(thisangle);

		var vector = { x: x, y: y };
		this.particles.push(new Particle(this.origx, this.origy, vector));
	}
};

//  intervalms	time in ms since update was last called
//  boundingrect	{ width, height }. assumes starts at 0,0 - TODO extend this
ParticleGenerator.prototype.update = function(intervalms, boundingrect) {

	if (this.particles.length == 0)
		return;

	// update coords and remove if they went outside the bounding rect
	this.particles = this.particles.filter(function(p, index, list) {
			
		// Calculate velocity that has occurred in this interval				
		var v = p.velocity * intervalms / 1000;
				
		p.posx = (p.posx + (p.vector.x * v));
		p.posy = (p.posy + (p.vector.y * v));

		if (p.posx < 0 || p.posx > boundingrect.width ||
			p.posy < 0 || p.posy > boundingrect.height) {

			return false;				    
		}
								
		return true;				
	});
	
	this.particles.forEach(function(p, index, list) {
		p.elapsedms += intervalms;
		if (p.elapsedms > 20) {
			p.elapsedms = 0;
			p.colour.blue += 40;
			if (p.colour.blue > 255)
				p.colour.blue = 0;
			p.colour.green = p.colour.blue;
		}
	});

	// Check on whether to add more particles
	
	var numRings = this.getAttr("numRings", 0);
	var ringInterval = this.getAttr("ringInterval", 200);

	this.time += intervalms;
	
	if (this.time > ringInterval && numRings > 0) {
		this.time = 0;
		this.attrs.numRings--;
		
		// add another ring 
		this.generate();
	}
	
	return this.particles.length > 0;
};

// Renders all the particles to the given context
//   ctx	context to draw particles in
ParticleGenerator.prototype.render = function(ctx) {

	if (this.particles.length == 0)
		return;

	this.particles.forEach(function(p) {	
		var oldfill = ctx.fillStyle;

		var x = Math.floor(p.posx);
		var y = Math.floor(p.posy);
		var sz = 5;

		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.fillRect(x, y, sz, sz);
		
		ctx.fillStyle = 'rgb(' + p.colour.red + ',' + p.colour.green + ',' + p.colour.blue + ')';
		ctx.fillRect(x+1, y+1, sz-1, sz-1);
		ctx.fillStyle = oldfill;	
	});
};

// ----------------------------------------------------------------------------
// PARTICLE
//

function PARTICLE() {
	this.generators = [];
};

PARTICLE.prototype.add = function(x, y, attrs) {
	if (typeof x == NaN || typeof y == NaN) {
		console.log('PARTICLE.add(' + x + ',' + y);
		return;
	}
	this.generators.push(new ParticleGenerator(x, y, attrs));
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


