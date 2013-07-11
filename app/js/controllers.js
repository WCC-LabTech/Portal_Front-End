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
		});
		login.error(function(data, status) {
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
	  var loggedin = is_loggedIn();
	  
	 // if (loggedin == true) {
		  $scope.lab_aide = true;
		  $scope.lab_tech = true;
	 	  $scope.faculty = true;
	  	$scope.admin = true;
	  //}

    $scope.$on('user_login', function() {
        $scope.lab_aide = true;
        $scope.lab_tech = true;
        $scope.faculty = true;
        $scope.admin = true; 
    });
  }])
  .controller('periods', ['$scope', '$http', function($scope, $http) {
	  var entries;
	  var categories;
	  var periods;
          var total;
          $scope.total = 0;
          $scope.on_campus = false;
	  
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
		  data.start_time = $scope.start_time + ":00";
		  data.end_time = $scope.end_time + ":00";
		  data.start_date = $scope.start_date;
                  
                  if ($scope.on_campus.checked == true) {
                            data.on_campus = true;
                  } else {
                            data.on_campus = false;
                  }
		  data.comments = $scope.comments;		  
		  api_call($http, 'workevent/', 'post', data);
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
	  var x;
          payperiods = api_call($http, 'payperiod/', 'get');
          payperiods.success(function(periods) {
          		for (x in periods) {
          			periods[x].id = get_id(periods[x].url);
          		}
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
			  console.log(data);

			  api_call($http, 'category/', 'post', data);
			  $scope.category = false;
		  }
  }])
  .controller('periodadmin', ['$scope', '$http', function($scope, $http) {
              var categories;
              var entries;
              var period;
              var users;
              var username;
              var x;
              var y;
              var z;
              var complete;
              var total = 0;

              categories = api_call($http, 'category/', 'get');
			  categories.success(function(response) {
              	  $scope.categories = response;
			  });

              users = api_call($http, 'user/', 'get');
              users.success(function(data) {
              		$scope.users = data;
              });
                            
              period = readCookie('period');
              $scope.period = readCookie('periodName');
              setTimeout(function() {
              	entries = api_call($http, 'report/timesheet/' + period + '/', 'get');
              	entries.success(function(entry) {
               		for (x in entry) {
               			username = $.grep($scope.users, function(e) {return e.url == 'http://home.cspuredesign.com:8080' + entry[x].user});
                    
               		    entry[x].user = username['0'].first_name + ' ' + username['0'].last_name;
               		    entry[x].category = 'http://home.cspuredesign.com:8080' + entry[x].category;
               		    entry[x] = adjustEntry(entry[x], $scope.categories);
               		}
              		complete = sort_reports(entry);
              		for (z in complete) {
              			total = 0;
              			for (y in complete[z]) {
              				if (complete[z][y].total != null) {
	              				total += complete[z][y].total;
	              			}
              			}
              			complete[z].total = total;

              		}
              		$scope.entries = complete;

              	});
              }, 50);

              $scope.predicate = "start_date";
              
  }])
  .controller('adminreports', ['$scope', '$http', function($scope, $http) {
  	if ($scope.report == 'category') {
  		$scope.layout = 'category';

  		data = api_call($http, 'report/timesheet/', 'get')

  	}

  }])
  .controller('inventoryhome', ['$scope', '$http', function($scope, $http) {
	 		var inventory;
			
			inventory = api_call($http, 'inventory/Equip/', 'get');
			inventory.success(function(equip) {
				$scope.equip = equip;
			});
      $scope.predicate = 'description.toString()';
  }])
  .controller('requestform', ['$scope', '$http', function($scope, $http) {

  		$scope.requestSubmit = function() {
			var due_date = new Date($scope.due_date).toISOString();

  			var data = {};
                        data.labtech_Name = $scope.lab_tech;
			data.faculty_Name = $scope.faculty_name;
			data.subject = $scope.subject;
			data.description = $scope.description;
			data.due_date = due_date;
			data.request_Type = $scope.request_type;
			data.request_status = 'pd';
			console.log(data);			
			api_call($http, 'request/admin/', 'post', data);
  		}
  }])
  .controller('requests', ['$scope', '$http', function($scope, $http) {
  		var requests;
		var x;
		var username;
    var users = {};
    var users_get = api_call($http, 'user/', 'get');
    $scope.predicate = 'description';
    users_get.success(function(response) {
      users = response;
    });

      setTimeout(function() {
  		requests = api_call($http, 'request/admin/', 'get');
  		
        requests.success(function(response) {
  		  
        	for (x in response) {
          response[x].due_date = new Date(response[x].due_date).toLocaleString();
	   			response[x].labtech_Name = getUserById(users, response[x].labtech_Name);
          if (response[x].request_status == "pd") {
            response[x].labtech_Name = "Requested: " + response[x].labtech_Name;
            response[x].request_status = "Pending";
            response[x].accept = true;
          }

			    }
         
					$scope.requests = response;
         
  		  });
      }, 100);

  }]);
