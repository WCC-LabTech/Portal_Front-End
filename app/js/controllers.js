'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', ['$scope', '$http', function($scope, $http) {
		var data;
		var periods;
		data = api_call($http, 'pay_period/', 'get');
		data.success(function(response) {
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
	  $scope.lab_aide = true;
	  $scope.lab_tech = true;
	  $scope.faculty = true;
	  $scope.admin = true;
  }])
  .controller('periods', ['$scope', '$http', function($scope, $http) {
	  var entries;
	  var categories;
	  var periods;
          var total;
          $scope.total = 0;
	  
	  $scope.form = false;
	  //Get Categories data
		categories = api_call($http, 'categories/', 'get');
		categories.success(function(response) {
			$scope.categories = response;
		});
	  
	  $scope.period = readCookie('period');
	  entries = api_call($http, 'events/pay_period/' + $scope.period + '/', 'get');
	  entries.success(function(data) {
		  var x;
		  var catName;
                  var start;
                  var end;
                  var mili;
                  var hours;
                  var day;
		  for (x in data) {
		  	catName = $.grep($scope.categories, function(e) {return e.id == data[x].category});
			data[x].category = catName['0'].name;
                        start = new Date(data[x].start_date + " " + data[x].start_time);
                        end = new Date(data[x].end_date + " " + data[x].end_time);
                        mili = end - start;
                        hours = (((mili / 1000) / 60) / 60);
                        
                        day = new Date(data[x].start_date);
                        day = day.getUTCDay();
                        data[x].day = weekDay(day);
                        data[x].total = hours;
                        $scope.total += hours;                  
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
		  data.end_date = $scope.end_date;
		  data.comments = $scope.comments;
		  
		  api_call($http, 'events/', 'post', data);
		  $scope.form = false;
                  $scope.total = 0;
                  setTimeout(function() {
                            entries = api_call($http, 'events/pay_period/' + $scope.period + '/', 'get');
                            entries.success(function(data) {
                                          var x;
                                          var catName;
                                          var start;
                                          var end;
                                          var mili;
                                          var hours;
                                          for (x in data) {
                                          	catName = $.grep($scope.categories, function(e) {return e.id == data[x].category});
                                          	data[x].category = catName['0'].name;
                                                start = new Date(data[x].start_date + " " + data[x].start_time);
                                                end = new Date(data[x].end_date + " " + data[x].end_time);
                                                mili = end - start;
                                                hours = (((mili / 1000) / 60) / 60);
                                                data[x].total = hours;
                                                $scope.total += hours; 
                                      }
                                  $scope.entries = data;
                            });
                  }, 500);
	  }
          
  }])
  .controller('tsadmin', ['$scope', '$http', function($scope, $http) {
	  var payperiods;
          payperiods = api_call($http, 'pay_period/', 'get');
          payperiods.success(function(periods) {
             $scope.periods = periods;
          });
          $scope.predicate = "-id";
          
          $scope.periodSubmit = function() {
              var data = {};
              data.name = $scope.name;
              data.start = $scope.start_date;
              data.end = $scope.end_date
              
              api_call($http, 'pay_period/', 'post', data);
              $scope.period = false;
              setTimeout(function() {
                            payperiods = api_call($http, 'pay_period/', 'get');
                            payperiods.success(function(periods) {
                                          $scope.periods = periods;
                            });
              }, 500);
              
          }
		  
		  $scope.catSubmit = function() {
			  var data = {};
			  data.name = $scope.catName;
			  data.is_project = $scope.is_project;
			  
			  api_call($http, 'categories/', 'post', data);
			  $scope.category = false;
		  }
  }])
  .controller('periodadmin', ['$scope', '$http', function($scope, $http) {
              var entries;
              var period;
              
              period = readCookie('period');
              entries = api_call($http, '', 'get');
              
  }]);