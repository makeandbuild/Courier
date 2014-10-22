'use strict';

var app = angular.module('courierApp');

app.controller('AgentCtrl', function($scope, $http, $location, $routeParams) {
	$scope.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];

	$scope.properties = {};
	
	if ($routeParams.agentId) {
		console.log($routeParams);
		$http.get('/api/agents/' + $routeParams.agentId).success(function(awesomeThings) {
			$scope.agent = awesomeThings;
            $scope.properties = awesomeThings.properties
		});
	}

	$scope.submit = function(agent) {

		if (agent._id) {
			$scope.agent.name = agent.name;

			$http.put('/api/agents/' + $routeParams.agentId, $scope.agent).success(function(response) {
				$location.path('/agents')
			});

		} else if(agent.customId){
            var newAgent = {
                customId: agent.customId,
                name: agent.name,
                location: agent.location
            };

            $http.post('/api/agents', newAgent);
            $location.path('/agents')

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