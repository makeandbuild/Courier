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

 	$scope.properties = {};

 	if ($routeParams.beaconId) {

 		$http.get('/api/beacons/' + $routeParams.beaconId).success(function(awesomeThings) {
 			$scope.beacon = awesomeThings;
 			$scope.properties = awesomeThings.properties;
 		});
 	}

 	$scope.addProperty = function(property) {
 		console.log (property);
 		$scope.properties[property.key] = property.value;
 		console.log($scope.properties);
 		$('.newKey').val('');
	 			$('.newValue').val('');
 	}
 		$scope.delProperty = function(key) {
 		console.log (key)
 		delete $scope.properties[key];
 		console.log($scope.properties);
 	}



 	$scope.submit = function(beacon) {

 		if (beacon._id) {
 			$scope.beacon.name= beacon.name;
 			$scope.beacon.uuid = beacon.uuid;
 			$scope.beacon.major = beacon.major;
 			$scope.beacon.minor = beacon.minor;

 			

 			$( ".property" ).each(function( index ) {
 				$scope.properties[$('.key.property'+index).text()] = $('.value.property'+index).val();
 				
			});

			if($('.newKey').val() != '' | $('.newValue').val() != ''){
 				$scope.properties[$('.newKey').val()] = $('.newValue').val();
 			};
			$scope.beacon.properties = $scope.properties;


 			$http.put('/api/beacons/'+$routeParams.beaconId, $scope.beacon).success(function(response) {
 				console.log(response);
	 			$('.newKey').val('');
	 			$('.newValue').val('');
	 		});

 		} else {
 			var newBeacon = {
 				name: beacon.name,
 				uuid: beacon.uuid,
 				major: beacon.major,
 				minor: beacon.minor,
 				properties: $scope.properties
 			};
 			

 			$http.post('/api/beacons', newBeacon);
 			$location.path('/')
 		}



 	};
 });