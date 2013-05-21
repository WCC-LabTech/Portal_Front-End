'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', ['$scope', '$http', function($scope, $http) {
		var data;
		var categories;
		/*tp, 'events', 'get');
		data.success(function(response) {
			console.log(response);
		});
		data.error(function() {
			alert('error');
		});
		
		//Get Categories data
		categories = api_call($http, 'categories', 'get');
		categories.success(function(response) {
			console.log(response);
		});
		*/
  }])
  .controller('userLogin', ['$scope', '$http', function($scope, $http) {
	  $scope.is_loggedIn = is_loggedIn();
		if ($scope.is_loggedIn == true) {
			$scope.username = readCookie("username");
		}
		var data = new Object;
		var login;
		$scope.login = function() {
		data = {"username": $scope.username, "password": $scope.password};
		login = api_call($http, 'api-token-auth/login', 'post', data);
		login.success(function(data) {
			setCookie('Authorization', data.token);
			setCookie('username', $scope.username);
			$scope.is_loggedIn = true;
		});
		login.error(function(status) {
			if (400 === status) {
            	$scope.invalidUsernamePassword = true;
        	} else {
				alert('No Response from Django Server');
			}
		});
    	return false;
	
	};
	
	$scope.logout = function() {
		setCookie('username', null);
		//setCookie('groups', null);
		setCookie('Authorization', null);
		document.location.reload(true);
	}
  }])
  .controller('nav', ['$scope', function($scope) {
	  $scope.lab_aide = true;
	  $scope.lab_tech = true;
	  $scope.faculty = true;
	  $scope.admin = true;
  }]);