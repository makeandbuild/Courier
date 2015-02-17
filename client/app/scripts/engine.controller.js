'use strict';

var app = angular.module('courierApp');

app.controller('EngineCtrl', function($scope, $http, $location, $routeParams) {
	$scope.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];

	$scope.properties = {};
	
	if ($routeParams.engineId) {
		console.log($routeParams);
		$http.get('/api/engines/' + $routeParams.engineId).success(function(engine) {
			$scope.engine = engine;
            $scope.properties = engine.properties;
		});
	}

	$scope.submit = function(engine) {

		if (engine._id) {
			$scope.engine.name = engine.name;

			$http.put('/api/engines/' + $routeParams.macAddress, $scope.engine).success(function(response) {
				$location.path('/engines')
			});

        } else {
//			var newEngine = {
//                macAddress: engine.macAddress,
//				name: engine.name,
//				location: engine.location,
//                ipAddress : engine.ipAddress,
//                capabilities : engine.capabilities
//			};

			$http.post('/api/engines', engine);
			$location.path('/engines')
		}
	};
});