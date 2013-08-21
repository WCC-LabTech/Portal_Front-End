'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }])
  .filter("totalHours", function() {
  return function(items) {
    var total = 0, i = 0;
    for (i = 0; i < items.length; i++) total += items[i].total;
    console.log(total);
    return total;
  }
});
