'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', ['$scope', '$http', function($scope, $http) {
		var data;
		var categories;
		data = api_call($http, 'events/', 'get');
		data.success(function(response) {
			
		});
		data.error(function() {
			alert('error');
		});
		
		//Get Categories data
		categories = api_call($http, 'categories/', 'get');
		categories.success(function(response) {
			;
		});
		
		function period(period) {
			$scope.period = period;
			console.log($scope.period);
		}
		
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
  }])
  .controller('periods', ['$scope', '$http', function($scope, $http) {
	  var entries;
	  $('#start_time').timepicker({timeFormat: 'HH:mm'}).val();
	  $('#end_time').timepicker({timeFormat: 'HH:mm'}).val();
	  $('#start_date').datepicker({ dateFormat: 'yy-mm-dd', showButtonPanel: true }).val();
	  $('#end_date').datepicker({ dateFormat: 'yy-mm-dd' }).val();
	  
	  
	  $scope.form = false;
	  $scope.period = readCookie('period');
	  entries = api_call($http, 'events/', 'get');
	  entries.success(function(data) {
		  $scope.entries = data;
	  });
	  
	  $scope.predicate = "start_date";
  }])
  .controller('addEntry', ['$scope', '$http', function($scope, $http) {
	  
	  $scope.formSubmit = function() {
		  var data = {};
		  data.start_time = $scope.start_time;
		  data.end_time = $scope.end_time;
		  data.start_date = $scope.start_date;
		  data.end_date = $scope.end_date;
		  
		  console.log(data);
		  $scope.form = false;
	  }
  }]);