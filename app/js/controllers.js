'use strict';

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
	
function userLogin($scope, $http) {
	
		var loggedIn;
		loggedIn = readCookie("username");
		
		if (loggedIn == "null" || loggedIn == null) {
			$scope.is_loggedIn = false;
		} else {
			$scope.is_loggedIn = true;
			$scope.username = loggedIn;
		}
		$scope.login = function() {
    	$http.post('Http://207.75.134.159:8080/api-token-auth/login', {"username": $scope.username, "password": $scope.password}).success(function(data, status, headers, config) {
        	console.log(status);
        	console.log(data);
			setCookie('Authorization', data.token);
			setCookie('username', $scope.username);
			$scope.is_loggedIn = true;
    	}).error(function(data, status, headers, config) {
        	if (400 === status) {
            	$scope.invalidUsernamePassword = true;
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
}
