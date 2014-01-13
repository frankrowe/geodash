var oldGeoDash = window.GeoDash
  , GeoDash = function () {}

GeoDash.version = '0.2f-dev'

GeoDash.noConflict = function () {
  window.GeoDash = oldGeoDash
  return this
}

window.GeoDash = GeoDash