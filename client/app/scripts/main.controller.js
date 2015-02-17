'use strict';

angular.module('courierApp')
  .controller('MainCtrl', function ($scope, $http, socket, $location, $filter, $routeParams) {
    $scope.awesomeThings = [];

    $http.get('/api/beacons').success(function(beacons) {
      console.log(beacons);
      $scope.beacons = beacons;
      socket.syncUpdates('beacon', $scope.beacons);
    });

    $scope.addBeacon = function(){
      console.log('addBeacon clicked');
      $location.path('/beacon');
    };

    $scope.deleteBeacon = function(beacon) {
      $http.delete('/api/beacons/' + beacon._id).success(function(response){
        $scope.beacons = $filter('filter')($scope.beacons, {_id: '!' + beacon._id});
      });
    };

    $scope.addAgent = function(){
      console.log('addAgent clicked');
      $location.path('/agent');
    };

    $scope.deleteAgent = function(agent) {
      $http.delete('/api/agents/' + agent._id).success(function(response){
        $scope.agents = $filter('filter')($scope.agents, {_id: '!' + agent._id});
      });
    };

    $scope.approveAgent = function(agent) {
      var updateAgent = agent;
      updateAgent.approvedStatus = 'Approved';
      $http.put('/api/agents/' + agent._id, updateAgent).success(function(response){
        $scope.getAgents();
      });
    };

    $scope.denyAgent = function(agent) {
      var updateAgent = agent;
      updateAgent.approvedStatus = 'Denied';
      $http.delete('/api/agents/' + agent._id, updateAgent).success(function(response){
        $scope.getAgents();
      });
    };

    $scope.getAgents = function() {
      $http.get('/api/agents').success(function(agents) {

        $scope.agents = $filter('filter')(agents, {
          approvedStatus: '!Pending'
        });
        $scope.pendingAgents = $filter('filter')(agents, {
          approvedStatus: 'Pending'
        });
        socket.syncUpdates('agent', $scope.agents);
      });
    };

    $scope.getEngines = function() {
        $http.get('/api/engines').success(function(engines) {
            console.log(engines);
            $scope.engines = engines;
            socket.syncUpdates('engine', $scope.beacons);
        });
    };

    $scope.addEngine = function(){
        console.log('addEngine clicked');
        $location.path('/engine');
    };

    $scope.deleteEngine = function(engine) {
        $http.delete('/api/engines/' + engine._id).success(function(response){
            $scope.engines = $filter('filter')($scope.engines, {_id: '!' + engine._id});
        });
    };

    $scope.getBeaconDetections = function() {
      $http.get('/api/beacondetections').success(function(detections) {
        $scope.detections = detections;
          // default to reverse sort by time
          $scope.predicate = '-time';

      });
    };

   

    if(typeof $routeParams.param === 'undefined'){
      $scope.activetab = 'beacons';
    }else {
      $scope.activetab = $routeParams.param;
    }
    $scope.getAgents();
    $scope.getBeaconDetections();
    $scope.getEngines();

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('beacon');
      socket.unsyncUpdates('agent');
      socket.unsyncUpdates('engine');
    });
  });
