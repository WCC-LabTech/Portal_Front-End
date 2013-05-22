'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('appDatepicker', ['datepicker', function($parse) {
  var directiveDefinitionObject = {
    restrict: 'A',
    link: function postLink(scope, iElement, iAttrs) {
      iElement.datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect: function(dateText, inst) {
          scope.$apply(function(scope){
            $parse(iAttrs.ngModel).assign(scope, dateText);
          });
        }
      });
    }
  };
  return directiveDefinitionObject;
}]);
