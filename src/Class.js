GeoDash.Class = {};

GeoDash.Class.inherit = function(c, p){
  var f = function(){};
  f.prototype = p.prototype;
  c.prototype = new f();
  c.prototype.constructor = c;
  return c;
}