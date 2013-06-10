'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', ['$scope', '$http', function($scope, $http) {
		var data;
		var periods;
                var x;
		data = api_call($http, 'payperiod/', 'get');
		data.success(function(response) {
                        for (x in response) {
                            response[x].id = get_id(response[x].url);
                            console.log(response[x].id);
                        }
			$scope.periods = response;
		});
		data.error(function() {
			alert('error');
		});
		
		$scope.predicate = "-id";
		
		function period(period) {
			$scope.period = period;
			console.log($scope.period);
		}
		
  }])
  .controller('userLogin', ['$scope', '$http', function($scope, $http) {
	  $scope.is_loggedIn = is_loggedIn();
		if ($scope.is_loggedIn == true) {
			$scope.username = readCookie("username");
			$http.defaults.headers.common['Authorization'] = 'Token ' + readCookie('Authorization');
		}
		var data = new Object;
		var login;
		$scope.login = function() {
		data = {"username": $scope.username, "password": $scope.password};
		login = api_call($http, 'api-token-auth/login', 'post', data);
		login.success(function(data) {
			setCookie('Authorization', data.token);
			setCookie('username', $scope.username);
			$http.defaults.headers.common['Authorization'] = 'Token ' + data.token;
			$scope.is_loggedIn = true;
			$scope.lab_aide = true;
		    $scope.lab_tech = true;
	 	    $scope.faculty = true;
	  	    $scope.admin = true;
			//$scope.$digest();
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
		$http.defaults.headers.common['Authorization'] = null;
		document.location.reload(true);
	}
  }])
  .controller('nav', ['$scope', function($scope) {
	  //var loggedin = is_loggedIn();
	  
	  //if (loggedin == true) {
		  $scope.lab_aide = true;
		  $scope.lab_tech = true;
	 	  $scope.faculty = true;
	  	  $scope.admin = true;
	  //}
  }])
  .controller('periods', ['$scope', '$http', function($scope, $http) {
	  var entries;
	  var categories;
	  var periods;
          var total;
          $scope.total = 0;
	  
	  $scope.form = false;
	  //Get Categories data
		categories = api_call($http, 'category/', 'get');
		categories.success(function(response) {
			$scope.categories = response;
		});
	  
	  $scope.period = readCookie('period');
          $scope.periodName = readCookie('periodName');
	  entries = api_call($http, 'workevent/payperiod/' + $scope.period + '/', 'get');
	  entries.success(function(data) {
		  var x;
		  for (x in data) {
                        data[x] = adjustEntry(data[x], $scope.categories);
                        $scope.total += data[x].total;
		  }
		  $scope.entries = data;
	  });
	  
	  $scope.predicate = "start_date";
	  
	  $scope.formSubmit = function() {
		  var data = {};
		  data.category = $scope.category;
		  data.start_time = $scope.start_time;
		  data.end_time = $scope.end_time;
		  data.start_date = $scope.start_date;
		  data.comments = $scope.comments;
		  
		  api_call($http, 'workevent', 'post', data);
		  $scope.form = false;
                  $scope.total = 0;
                  setTimeout(function() {
                            entries = api_call($http, 'workevent/payperiod/' + $scope.period + '/', 'get');
                            entries.success(function(data) {
                                          var x;
                                          for (x in data) {
                                                data[x] = adjustEntry(data[x], $scope.categories);
                                                $scope.total += data[x].total;
                                      }
                                  $scope.entries = data;
                            });
                  }, 500);
	  }
          
  }])
  .controller('tsadmin', ['$scope', '$http', function($scope, $http) {
	  var payperiods;
          payperiods = api_call($http, 'payperiod/', 'get');
          payperiods.success(function(periods) {
             $scope.periods = periods;
          });
          $scope.predicate = "-id";
          
          $scope.periodSubmit = function() {
              var data = {};
              data.name = $scope.name;
              data.start = $scope.start_date;
              data.end = $scope.end_date
              
              api_call($http, 'payperiod/', 'post', data);
              $scope.period = false;
              setTimeout(function() {
                            payperiods = api_call($http, 'payperiod/', 'get');
                            payperiods.success(function(periods) {
                                          $scope.periods = periods;
                            });
              }, 500);
              
          }
		  
		  $scope.catSubmit = function() {
			  var data = {};
			  data.name = $scope.catName;
			  data.is_project = $scope.is_project;
			  
			  api_call($http, 'category/', 'post', data);
			  $scope.category = false;
		  }
  }])
  .controller('periodadmin', ['$scope', '$http', function($scope, $http) {
              var entries;
              var period;
              
              period = readCookie('period');
              entries = api_call($http, '', 'get');
              
  }]);