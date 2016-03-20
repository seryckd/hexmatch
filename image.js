/* IMAGE Module
 * Loads up images
 *
 */

var IMAGE = (function () {
   "use strict";

   var allReady = false,
      images = {};

   return {

      load: function (name, file) {

         var i = {
            name: name,
            image: new Image(),
            ready: false
         };

         images[name] = i;

         i.image.onload = function () {
            images[name].ready = true;
         };

         i.image.src = file;

         allReady = false;

         return i.image;
      },

      isReady: function () {

         var name;

         if (!allReady) {
            for (name in images) {
               if (!images[name].ready) {
                  return false;
               }
            }
         }

         allReady = true;
         return allReady;
      },

      image: function (name) {
         return images[name].image;
      }
   };

}());
