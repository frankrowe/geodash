var oldGeoDash = window.GeoDash,
    GeoDash = {};

GeoDash.version = '0.1-dev';

GeoDash.noConflict = function () {
  window.GeoDash = oldGeoDash;
  return this;
};

window.GeoDash = GeoDash;

/*
Helper functions
*/
//console log
function log(msg) {
    if (typeof console != 'undefined')
        console.log(msg);
}