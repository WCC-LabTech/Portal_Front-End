'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'partials/home.html'});
    $routeProvider.when('/timesheet', {templateUrl: 'partials/timesheets/home.html', controller: 'MyCtrl2'});
	$routeProvider.when('/periods', {templateUrl: 'partials/timesheets/periods.html', controller: 'periods'});
	$routeProvider.when('/tsadmin', {templateUrl: 'partials/timesheets/admin.html', controller: 'tsadmin'});
	$routeProvider.when('/adminperiods', {templateUrl: 'partials/timesheets/adminperiods.html', controller: 'periodadmin'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
