// ----------------------------------------------------------------------------
// PartGenCircle

function PartGenCircle() {	
};

PartGenCircle.prototype.init = function(origx, origy, attrs) {
	this.particles = [];

	this.origx = origx;
	this.origy = origy;
	this.time = 0;
	this.attrs = attrs;
			
	this.generate();
};

PartGenCircle.prototype.getAttr = function(field, defvalue) {
	var val = this.attrs[field];

	return typeof val == 'undefined' ? defvalue : val;
};

PartGenCircle.prototype.generate = function() {

	var number = this.getAttr("number", 10);
	
	var angle = 2*Math.PI/number + (Math.random() * Math.PI/4);

	for(var count=0; count<number; ++count) {			

		var thisangle = angle * count;
		
		var newp = new Particle(this.origx, this.origy);
		
		newp.setAttr('velocity', 200 + Math.round(Math.random() * 300));
		newp.setAttr('colour', { red:255, green:0, blue:0 });		
		newp.setAttr('angle', thisangle);
		
		newp.setAttr('curp', {x:this.origx,y:this.origy});
				
		this.particles.push(newp);
	}
};

// rotate point p around point c by angle (radians)
PartGenCircle.prototype.rotate = function(c, angle, p) {
	var sin = Math.sin(angle);
	var cos = Math.cos(angle);

	// translate to c
	var x = p.x - c.x;
	var y = p.y - c.y;

	// rotate
	var nx = x*cos - y*sin;
	var ny = x*sin + y*cos;

	// translate back
	return { x:nx+c.x, y:ny+c.y };
}

//  intervalms	time in ms since update was last called
//  boundingrect	{ width, height }. assumes starts at 0,0 - TODO extend this
PartGenCircle.prototype.update = function(intervalms, boundingrect) {

	if (this.particles.length == 0)
		return;
		
	var rotatef = this.rotate;
		
	// update coords and remove if they went outside the bounding rect
	this.particles = this.particles.filter(function(p, index, list) {
						
		// Calculate velocity that has occurred in this interval				
		var v = p.getAttr('velocity') * intervalms / 1000;
		
		var angle = p.getAttr('angle');
		var curp = p.getAttr('curp');
		curp.x = curp.x + v;

		var np = rotatef({ x:p.startx, y:p.starty }, 
			angle, 
			{x:curp.x,y:curp.y+Math.sin(curp.x)*5});

		if (np.x < 0 || np.x > boundingrect.width ||
			np.y < 0 || np.y > boundingrect.height) {

			return false;				    
		}
		
		p.posx = np.x;
		p.posy = np.y;
								
		return true;				
	});
	
	this.particles.forEach(function(p, index, list) {
		p.elapsedms += intervalms;
		if (p.elapsedms > 20) {
			p.elapsedms = 0;
			
			var colour = p.getAttr("colour");
			
			colour.blue += 40;
			if (colour.blue > 255)
				colour.blue = 0;
			colour.green = colour.blue;
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
PartGenCircle.prototype.render = function(ctx) {

	if (this.particles.length == 0)
		return;

	this.particles.forEach(function(p) {	
		var oldfill = ctx.fillStyle;

		var x = Math.floor(p.posx);
		var y = Math.floor(p.posy);
		var sz = 6;

		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.fillRect(x, y, sz, sz);

		var colour = p.getAttr("colour");
		
		ctx.fillStyle = 'rgb(' + colour.red + ',' + colour.green + ',' + colour.blue + ')';
		ctx.fillRect(x+1, y+1, sz-1, sz-1);
		ctx.fillStyle = oldfill;	
	});
};
