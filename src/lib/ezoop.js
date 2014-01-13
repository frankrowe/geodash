var _ezoop = window.ezoop,
    ezoop = function () {};

ezoop.version = '0.1'

ezoop.noConflict = function () {
  window.ezoop = _ezoop;
  return this;
};

window.ezoop = ezoop;

ezoop.ExtendedClass = function(parentClass, properties) {
  return ezoop.Class(parentClass, properties);
}

ezoop.BaseClass = function(properties) {
  return ezoop.Class(null, properties);
}

ezoop.Class = function (parentClass, childClass) {
  var _class_ = null;
  var self = ezoop.Class;
  if (parentClass == null || typeof parentClass == 'undefined') {
    _class_ = function () {
      if (typeof this.initialize != 'undefined') {
        this.initialize.apply(this, arguments);
      }
    }
    _class_.prototype = childClass;
  }
  else {
    _class_ = function () {
      if (typeof parentClass.prototype != 'undefined') {
        var parentInit = parentClass.prototype.initialize;
        if (typeof parentInit == 'function') {
          parentInit.apply(this, arguments);
        }
      }
      var init = typeof this.initialize == "function" ? this.initialize : 'undefined';
        if (typeof init == 'function') {
          init.apply(this, arguments);
        }
    }
    self.inheritPrototype(_class_, parentClass); //inherit prototype
    self.augmentPrototype(_class_.prototype, childClass); //augment prototype
  }
  return _class_;
}

ezoop.Class.inheritPrototype = function (child, parent) {
  var f = function () { };
  f.prototype = parent.prototype;
  child.prototype = new f();
  child.prototype.constructor = child;
  child.parent = parent.prototype;
}

ezoop.Class.augmentPrototype = function (child, parent) {
  child = child || {};
  if (parent) {
    for (var property in parent) {
      var value = parent[property];
      if (value !== undefined) {
        child[property] = value;
      }
    }
    var sourceIsEvt = typeof window.Event == "function" && parent instanceof window.Event;
    if (!sourceIsEvt && parent.hasOwnProperty && parent.hasOwnProperty("toString")) {
      child.toString = parent.toString;
    }
  }
}