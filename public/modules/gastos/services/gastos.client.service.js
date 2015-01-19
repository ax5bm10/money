'use strict';

//Gastos service used to communicate Gastos REST endpoints
angular.module('gastos').factory('Gastos', ['$resource',
	function($resource) {
		return $resource('gastos/:gastoId', { gastoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);