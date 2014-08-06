'use strict';

/**
 * @ngdoc function
 * @name ibeaconApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ibeaconApp
 */
var app = angular.module('courierApp');

app.controller('BeaconCtrl', function($scope, $http, $location, $routeParams) {
	$scope.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];

	if ($routeParams.beaconId) {

		$http.get('/api/beacons/' + $routeParams.beaconId).success(function(awesomeThings) {
				$scope.beacon = awesomeThings;
			});
	}



	$scope.submit = function(beacon) {

		if (beacon._id) {
				$scope.beacon.name= beacon.name;
				$scope.beacon.uuid = beacon.uuid;
				$scope.beacon.major = beacon.major;
				$scope.beacon.minor = beacon.minor;
				$http.put('/api/beacons/'+$routeParams.beaconId, $scope.beacon);
		} else {
			var newBeacon = {
				name: beacon.name,
				uuid: beacon.uuid,
				major: beacon.major,
				minor: beacon.minor
			};

			$http.post('/api/beacons', newBeacon);
			$location.path('/')
		}
		


	};
});