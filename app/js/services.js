'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.2')
  .factory('userLogin', ['$http', function($http, data) {
	 $http.post('Http://home.cspuredesign.com:8080/api-token-auth/login', {"username": $scope.username, "password": $scope.password}).success(function(data) {
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
	url = "Http://home.cspuredesign.com:8080/" + api;
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

function is_loggedIn() {
	var loggedIn;
	loggedIn = readCookie("username");
	if (loggedIn == "null" || loggedIn == null) {
			return false;
		} else {
			return true;
		}
}