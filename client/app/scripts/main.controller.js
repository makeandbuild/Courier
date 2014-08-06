'use strict';

angular.module('courierApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/beacons').success(function(awesomeThings) {
      console.log(awesomeThings);
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('beacon', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/beacons', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(beacon) {
      $http.delete('/api/beacons/' + beacon._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('beacon');
    });
  });