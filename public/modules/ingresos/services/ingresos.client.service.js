'use strict';

//Ingresos service used to communicate Ingresos REST endpoints
angular.module('ingresos').factory('Ingresos', ['$resource',
	function($resource) {
		return $resource('ingresos/:ingresoId', { ingresoId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);