'use strict';

 var app = angular.module('courierApp');

 app.controller('AgentCtrl', function($scope, $http, $location, $routeParams) {
    $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
    ];

    $scope.properties = {};

    if ($routeParams.AgentId) {

        $http.get('/api/agents/' + $routeParams.beaconId).success(function(awesomeThings) {
            $scope.agent = awesomeThings;
        });
    }

    $scope.submit = function(agent) {

        if (agent._id) {
            $scope.agent.name= agent.name;

            $http.put('/api/agents/' + $routeParams.agentId, $scope.agent).success(function(response) {
                console.log(response);
            });

        } else {
            var newAgent = {
                name: agent.name,
                location: agent.location
            };

            $http.post('/api/agents', newAgent);
            $location.path('/agents')
        }
    };
 });
