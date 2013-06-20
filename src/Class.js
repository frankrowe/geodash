GeoDash.Class = {};

GeoDash.Class.inherit = function(c, p){
  var F = function(){};
  F.prototype = p.prototype;
  c.prototype = new F();
  c.prototype.constructor = c;
  return c;
}