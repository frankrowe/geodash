var oldGeoDash = window.GeoDash
  , GeoDash = function () {}

GeoDash.version = '0.1-dev'

GeoDash.noConflict = function () {
  window.GeoDash = oldGeoDash
  return this
}

window.GeoDash = GeoDash

