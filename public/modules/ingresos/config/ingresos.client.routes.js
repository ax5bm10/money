'use strict';

//Setting up route
angular.module('ingresos').config(['$stateProvider',
	function($stateProvider) {
		// Ingresos state routing
		$stateProvider.
		state('listIngresos', {
			url: '/ingresos',
			templateUrl: 'modules/ingresos/views/list-ingresos.client.view.html'
		}).
		state('createIngreso', {
			url: '/ingresos/create',
			templateUrl: 'modules/ingresos/views/create-ingreso.client.view.html'
		}).
		state('viewIngreso', {
			url: '/ingresos/:ingresoId',
			templateUrl: 'modules/ingresos/views/view-ingreso.client.view.html'
		}).
		state('editIngreso', {
			url: '/ingresos/:ingresoId/edit',
			templateUrl: 'modules/ingresos/views/edit-ingreso.client.view.html'
		});
	}
]);