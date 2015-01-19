'use strict';

// Ingresos controller
angular.module('ingresos').controller('IngresosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ingresos', 'Socket',
	function($scope, $stateParams, $location, Authentication, Ingresos, Socket) {
		$scope.authentication = Authentication;

		// Create new Ingreso
		$scope.create = function() {
			// Create new Ingreso object
			var ingreso = new Ingresos ({
				motivo: this.motivo,
				monto: this.monto,
			});

			// Redirect after save
			ingreso.$save(function(response) {
				$location.path('ingresos');

				// Clear form fields
				$scope.motivo = '';
				$scope.monto = 0;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ingreso
		$scope.remove = function(ingreso) {
			if ( ingreso ) { 
				ingreso.$remove();

				for (var i in $scope.ingresos) {
					if ($scope.ingresos [i] === ingreso) {
						$scope.ingresos.splice(i, 1);
					}
				}
			} else {
				$scope.ingreso.$remove(function() {
					$location.path('ingresos');
				});
			}
		};

		// Update existing Ingreso
		$scope.update = function() {
			var ingreso = $scope.ingreso;

			ingreso.$update(function() {
				$location.path('ingresos/' + ingreso._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ingresos
		$scope.find = function() {
			$scope.ingresos = Ingresos.query();
		};

		// Find existing Ingreso
		$scope.findOne = function() {
			$scope.ingreso = Ingresos.get({ 
				ingresoId: $stateParams.ingresoId
			});
		};

		$scope.getTotal = function () {
			var total = 0;
    		for(var i = 0; i < $scope.ingresos.length; i++){
        		var ingreso = $scope.ingresos[i];
        		total += ingreso.monto;
    		}
    		return total;
		};
		

		Socket.on('ingreso', function() {
    		$scope.find();
		});
	}
]);