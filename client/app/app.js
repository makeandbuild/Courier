'use strict';

angular.module('courierApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'btford.socket-io',
	'ui.bootstrap'
])
	.config(function($routeProvider, $locationProvider, $httpProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'app/views/main.html',
				controller: 'MainCtrl',
				authenticate: true
			})
			.when('/agent', {
				templateUrl: 'app/views/agent.html',
				controller: 'AgentCtrl'
			})
			.when('/agent/:agentId', {
				templateUrl: 'app/views/agent.html',
				controller: 'AgentCtrl'
			})
			.when('/beacon', {
				templateUrl: 'app/views/beacon.html',
				controller: 'BeaconCtrl'
			})
			.when('/beacon/:beaconId', {
				templateUrl: 'app/views/beacon.html',
				controller: 'BeaconCtrl'
			})
			.when('/login', {
				templateUrl: 'app/views/login.html',
				controller: 'LoginCtrl'
			})
			.when('/signup', {
				templateUrl: 'app/views/signup.html',
				controller: 'SignupCtrl'
			})
			.when('/settings', {
				templateUrl: 'app/views/settings.html',
				controller: 'SettingsCtrl',
				authenticate: true
			})
			.when('/admin', {
				templateUrl: 'app/views/admin.html',
				controller: 'AdminCtrl'
			})
			.when('/:param', {
				templateUrl: 'app/views/main.html',
				controller: 'MainCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.html5Mode(true);
		$httpProvider.interceptors.push('authInterceptor');


	})

.factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
	return {
		// Add authorization token to headers
		request: function(config) {
			config.headers = config.headers || {};
			if ($cookieStore.get('token')) {
				config.headers['x-access-token'] = $cookieStore.get('token');
			}
			return config;
		},

		// Intercept 401s and redirect you to login
		responseError: function(response) {
			if (response.status === 401) {
				$location.path('/login');
				// remove any stale tokens
				$cookieStore.remove('token');
				return $q.reject(response);
			} else {
				return $q.reject(response);
			}
		}
	};
})

.run(function($rootScope, $location, Auth) {
	// Redirect to login if route requires auth and you're not logged in
	$rootScope.$on('$routeChangeStart', function(event, next) {
		Auth.isLoggedInAsync(function(loggedIn) {
			if (next.authenticate && !loggedIn) {
				$location.path('/login');
			}
		});
	});
});