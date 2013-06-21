/*
Class name: Class
Description: implements inheritance
*/
GeoDash.Class = function (child) {
    var ch = child;
    var p = ch.extend;
    var _class_ = null;
    if (p == null || typeof p == 'undefined') {
        _class_ = function () {
            if (typeof this.initialize != 'undefined')
                this.initialize.apply(this, arguments);
        };
        _class_.prototype = ch;
    }
    else {
        _class_ = function () {
            /*
                check if parent's prototype exists
                this is to eliminate the case where an "invalid" parent object 
                is passed to child.extend 
                (for example: bad name or typo makes parent class not exist, therefore, 
                p has 'undefined' value which does not have a prototype
            */
            if (typeof p.prototype != null) {
                var parentInit = p.prototype.initialize;
                if (typeof parentInit == 'function') {
                    parentInit.apply(this, arguments);
                }
            }
            var init = typeof this.initialize == "function" ? this.initialize : 'undefined';
            //run child initialize function if exists
            if (typeof init == 'function') {
                init.apply(this, arguments);
            }
        };
        extend(_class_, p); //inherit prototype
        extend2(_class_.prototype, ch); //augment prototype
    }
    return _class_;
};

extend = function (child, parent) {
    var F = function () { };
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    child.parent = parent.prototype;
};
extend2 = function (child, parent) {
    child = child || {};
    if (parent) {
        for (var property in parent) {
            var value = parent[property];
            if (value !== undefined) {
                child[property] = value;
            }
        }
        /**
        * IE doesn't include the toString property when iterating over an object's
        * properties with the for(property in object) syntax.  Explicitly check if
        * the parent has its own toString property.
        */
        /*
        * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
        * prototype object" when calling hawOwnProperty if the parent object
        * is an instance of window.Event.
        */

        var sourceIsEvt = typeof window.Event == "function"
                          && parent instanceof window.Event;

        if (!sourceIsEvt &&
                parent.hasOwnProperty && parent.hasOwnProperty("toString")) {
            child.toString = parent.toString;
        }
    }
};

