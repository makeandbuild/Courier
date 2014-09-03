'use strict';

angular.module('courierApp')
  .controller('MainCtrl', function ($scope, $http, socket, $location, $filter, $routeParams) {
    $scope.awesomeThings = [];
    $http.get('/api/beacons').success(function(awesomeThings) {
      console.log(awesomeThings);
      $scope.beacons = awesomeThings;
      socket.syncUpdates('beacon', $scope.beacons);
    });

    $http.get('/api/agents').success(function(agents) {
      $scope.agents = agents;
      socket.syncUpdates('agent', $scope.agents);
    });

    $scope.addBeacon = function(){
      console.log('addBeacon clicked');
      $location.path('/beacon');
    };

    $scope.deleteBeacon = function(beacon) {
      $http.delete('/api/beacons/' + beacon._id).success(function(response){
         $scope.beacons = $filter('filter')($scope.beacons, {_id: '!' + agent._id});
      });
    }

    $scope.addAgent = function(){
      console.log('addAgent clicked');
      $location.path('/agent');
    };


    $scope.deleteAgent = function(agent) {
      $http.delete('/api/agents/' + agent._id).success(function(response){
         $scope.agents = $filter('filter')($scope.agents, {_id: '!' + agent._id});
      });
    }

    if(typeof $routeParams.param == 'undefined'){
        $scope.activetab ="beacons";
    }else {
        $scope.activetab = $routeParams.param
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('beacon');
      socket.unsyncUpdates('agent');
    });
  });
