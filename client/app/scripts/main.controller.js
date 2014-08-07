'use strict';

angular.module('courierApp')
  .controller('MainCtrl', function ($scope, $http, socket, $location) {
    $scope.awesomeThings = [];

    $http.get('/api/beacons').success(function(awesomeThings) {
      console.log(awesomeThings);
      $scope.beacons = awesomeThings;
      socket.syncUpdates('beacon', $scope.beacons);
    });

    $scope.addBeacon = function(){
      console.log('addBeacon clicked');
      $location.path('/beacon');
    };
   

    $scope.deleteBeacon = function(beacon) {
      $http.delete('/api/beacons/' + beacon._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('beacon');
    });
  });