'use strict';

//Setting up route
angular.module('gastos').config(['$stateProvider',
	function($stateProvider) {
		// Gastos state routing
		$stateProvider.
		state('listGastos', {
			url: '/gastos',
			templateUrl: 'modules/gastos/views/list-gastos.client.view.html'
		}).
		state('createGasto', {
			url: '/gastos/create',
			templateUrl: 'modules/gastos/views/create-gasto.client.view.html'
		}).
		state('viewGasto', {
			url: '/gastos/:gastoId',
			templateUrl: 'modules/gastos/views/view-gasto.client.view.html'
		}).
		state('editGasto', {
			url: '/gastos/:gastoId/edit',
			templateUrl: 'modules/gastos/views/edit-gasto.client.view.html'
		});
	}
]);