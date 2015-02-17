'use strict';

var app = angular.module('courierApp');

app.controller('EngineCtrl', function($scope, $http, $location, $routeParams) {
	$scope.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];

	$scope.properties = {};
	
	if ($routeParams.macAddress) {
		console.log($routeParams);
		$http.get('/api/engines/' + $routeParams.macAddress).success(function(engine) {
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

		} else if(engine.macAddress){
            var newEngine = {
                macAddress: engine.macAddress,
                name: engine.name,
                location: engine.location
            };

            $http.post('/api/engines', newEngine);
            $location.path('/engines')

        } else {
			var newEngine = {
				name: engine.name,
				location: engine.location
			};

			$http.post('/api/engines', newEngine);
			$location.path('/engines')
		}
	};
});