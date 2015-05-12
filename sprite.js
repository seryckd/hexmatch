// TODO
// -- modify load() so that a default height and width can be specified,
//   in which case do not need to specify height and width on every line 
//   although can override if want

/*
SpriteRef = {
 name : "",
 height:
 width:
 x:,
 y: ,
}
*/

/*
// spritesheet
// spriteref
// spriteanim
SPRITE.load("twinkle", "images/twinkle.png", [
  { name: "1", height:40, height:40, x:0, y:0 }
],
   [
   { name:"shine1", refs:[ "1", "2", "3" ], durationms:100}
   ]
);

var sheet = SPRITE.sheet("twinkle");
var spriteref = sheet.sprite("1");
SPRITE.image(spriteref);
var spriteanim = sheet.animation("shine1");
spriteanim.update(time);
var spriteref = spriteanim.image(time);
*/

var SpriteInfo = function(info, image) {
  this.name = info.name;
  this.height = info.height;
  this.width = info.width;
  this.x = info.x;
  this.y = info.y;
  
  // reference to SpriteSheet.image
  this.image = image;
};

var SpriteAnimation = function(animation) {
  this.animation = animation;
  this.name = animation.name;
  
  this.elapsedms = 0;
  this.currentframe = 0;
  this.currentsprite = this.animation.sprites[0];
};

SpriteAnimation.prototype.update = function(intervalms){

  this.elapsedms += intervalms;
  
  if (this.elapsedms >= this.animation.durationms) {
    this.elapsedms = 0;
    
    if (++this.currentframe >= this.animation.sprites.length)
      this.currentframe = 0;
      
    this.currentsprite = this.animation.sprites[this.currentframe];
  }
};

SpriteAnimation.prototype.sprite = function() {
  return this.currentsprite;
}

var SPRITE = (function() {

  sheets = {};

  return {
    // Public Interface
    
    load: function(name, filename, sprites, animations) {
	
      var image = IMAGE.load(name, filename);
      
      var sheet = {
        name: name,
        image: image,
        sprites: [],		// map name, SpriteInfo
        animations: []		// map name, SpriteAnimation
      };
      
      for(var count=0; count<sprites.length; ++count) {
        var sprite = sprites[count];
        sheet.sprites[sprite.name] = new SpriteInfo(sprite, image);
      }
      
      if (animations)
        for(var count2=0; count2<animations.length; ++count2) {
          var animation = animations[count2];

          var spriteinfos = [];
          for(var count3=0; count3<animation.spritenames.length; ++count3) {
            var spritename = animation.spritenames[count3];
            var spriteinfo = sheet.sprites[spritename];
            spriteinfos.push(spriteinfo);
          };          

          sheet.animations[animation.name] = {
            name: animation.name,
            durationms: animation.durationms,
            sprites: spriteinfos,
            
            makeinstance: function() {
              return new SpriteAnimation(this);
            }
          };
 		}
      
      sheets[name] = sheet;
    },
    
    // return SpriteInfo
    sprite: function(sheetname, spritename) {
      return sheets[sheetname].sprites[spritename];
    },
    
    // return SpriteAnimation
    animation: function(sheetname, animationname) {
      var sa = sheets[sheetname].animations[animationname];
      return sa.makeinstance();
    }
  };

}());
