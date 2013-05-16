'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var labaide = angular.module('labaide.services', []);
labaide.factory('user', function() {
	return {
		is_loggedIn : false,
		username : null,
	}
});