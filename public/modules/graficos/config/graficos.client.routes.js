'use strict';

//Setting up route
angular.module('graficos').config(['$stateProvider',
	function($stateProvider) {
		// Graficos state routing
		$stateProvider.
		state('graficos', {
			url: '/graficos',
			templateUrl: 'modules/graficos/views/graficos.client.view.html'
		});
	}
]);