angular.module('api', ['ngRoute'])

.factory('HMAC', function($rootScope) {
  var hmac = {
    hash: function(secret, method, path) {
      var time = Math.floor(new Date().getTime() / Math.pow(10, 5));
      var hash = CryptoJS.HmacSHA256(method + "+" + path + "+" + time, secret);
      return hash.toString(CryptoJS.enc.Base64);
    },
    hmac: function(uuid, hash) {
      return "hmac " + uuid + ":" + hash;
    }
  };

  return hmac;
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push(function ($q, $rootScope, HMAC) {
    return {
      request: function(config) {
        if($rootScope.uuid != undefined && $rootScope.secret != undefined) {
          var hash = HMAC.hash($rootScope.secret, config.method, config.url);
          config.headers['Authentication'] = HMAC.hmac($rootScope.uuid, hash);
        }
        return config || $q.when(config);
      },
      response: function(response) {
        return response || $q.when(response);
      }
    }
  });
})

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'ApiCtrl',
      templateUrl: 'api.html'
    });
})

.controller('ApiCtrl', function ($scope, $rootScope, $log, $http) {
  $rootScope.uuid = "uid";
  $rootScope.secret = "s";

  $scope.call = function() {
    $http({method: "GET", url: "/api"}).
      success(function(data, status) {
        $log.info(data);
      }).
      error(function(data, status) {
        $log.info(data);
      });
  };
});