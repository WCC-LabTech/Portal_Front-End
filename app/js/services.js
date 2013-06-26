'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.2')
  .factory('userLogin', ['$http', function($http, data) {
	 $http.post('Http://207.75.134.87:8080/api-token-auth/login', {"username": $scope.username, "password": $scope.password}).success(function(data) {
		user.data = data;
		user.auth = true;
		return user;
	 }).error(function() {
		 user.auth = false;
		 return user;
	 });
	  
  }]);

function api_url(api) {
	var url;
	url = "Http://207.75.134.87:8080/" + api;
	return url;
}

function api_call($http, api, method, data) {
	var respond;
	if (method == 'post') {
		respond = $http.post(api_url(api), data);
	}
	if (method == 'get') {
		respond = $http.get(api_url(api));
	}
	
	return respond;
}

function getCat($http, cat) {
	var category
	$http.get(api_url('categories/' + cat + '/')).success(function(data) {
		console.log(data.name);
		category = data.name;
	});
	
	return category;
}

function readCookie(key) {
	var currentcookie;
	var firstidx;
	var lastidx;
	currentcookie = document.cookie;
    if (currentcookie.length > 0)
    {
        firstidx = currentcookie.indexOf(key + "=");
        if (firstidx != -1)
        {
            firstidx = firstidx + key.length + 1;
            lastidx = currentcookie.indexOf(";",firstidx);
            if (lastidx == -1)
            {
                lastidx = currentcookie.length;
            }
            return unescape(currentcookie.substring(firstidx, lastidx));
        }
    }
    return null;
}

function setCookie(c_name,value) {
	var exdate= cookieExp();
	var c_value=escape(value) + "; expires="+exdate;
	document.cookie=c_name + "=" + c_value;
}

function cookieExp() {
	var currentDate = new Date();
	var expDate = new Date(currentDate.getTime() + 86400000);
	
	return expDate.toGMTString();
}

function get_id(url) {
       var split = url.split('/');
       var id = split[split.length - 1];
       
       return id;
}

function is_loggedIn() {
	var loggedIn;
	loggedIn = readCookie("username");
	if (loggedIn == "null" || loggedIn == null) {
			return false;
		} else {
			return true;
		}
}

function weekDay(day) {
       var weekday=new Array(7);
       weekday[0]="Sunday";
       weekday[1]="Monday";
       weekday[2]="Tuesday";
       weekday[3]="Wednesday";
       weekday[4]="Thursday";
       weekday[5]="Friday";
       weekday[6]="Saturday";
       
       return weekday[day];
}

function adjustEntry(data, categories) {
       var catName;
       var start;
       var end;
       var mili;
       var hours;
       var day;
       
       catName = $.grep(categories, function(e) {return e.url == data.category});
       data.category = catName['0'].name;
       start = new Date(data.start_date + " " + data.start_time);
       end = new Date(data.start_date + " " + data.end_time);
       mili = end - start;
       hours = (((mili / 1000) / 60) / 60);
       day = new Date(data.start_date);
       day = day.getUTCDay();
       data.day = weekDay(day);
       data.total = Math.round(hours *100) / 100;
              
       return data;
       
}

function get_username($http, data) {
  var returnuser = null;
  var userlink = data.substring(1);
  var user = api_call($http, userlink, 'get');
  user.success(function(username) {
      returnuser = username.username;
  });
  console.log(returnuser);
}

function sort_reports(data) {
  var response = {};
  var x;
  var iter = 0;
  for (x in data) {
      if (typeof response[data[x].user] == 'undefined') {
        response[data[x].user] = {};
        response[data[x].user].username = data[x].user;
      }
      response[data[x].user][iter] = {};

      response[data[x].user][iter]['start_date'] = data[x].start_date;
      response[data[x].user][iter]['category'] = data[x].category;
      response[data[x].user][iter]['start_time'] = data[x].start_time;
      response[data[x].user][iter]['end_time'] = data[x].end_time;
      response[data[x].user][iter]['total'] = data[x].total;
      iter = iter + 1;
    }
  

  return response;
}