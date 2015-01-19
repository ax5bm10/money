'use strict';

// Gastos controller
angular.module('gastos').controller('GastosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gastos', 'Socket', 'Ingresos',
	function($scope, $stateParams, $location, Authentication, Gastos, Socket, Ingresos) {
		$scope.authentication = Authentication;
		$scope.ingresos = Ingresos.query();
		// Create new Gasto
		$scope.create = function() {
			// Create new Gasto object
			var gasto = new Gastos ({
				motivo: this.motivo,
				monto: this.monto
			});

			// Redirect after save
			gasto.$save(function(response) {
				$location.path('gastos');

				// Clear form fields
				$scope.motivo = '';
				$scope.monto = 0;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gasto
		$scope.remove = function(gasto) {
			if ( gasto ) { 
				gasto.$remove();

				for (var i in $scope.gastos) {
					if ($scope.gastos [i] === gasto) {
						console.log($scope.gastos.splice(i,1));
						$scope.gastos.splice(i, 1);
					}
				}
			} else {
				$scope.gasto.$remove(function() {
					$location.path('gastos');
				});
			}
		};

		// Update existing Gasto
		$scope.update = function() {
			var gasto = $scope.gasto;

			gasto.$update(function() {
				$location.path('gastos/' + gasto._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Gastos
		$scope.find = function() {
			$scope.gastos = Gastos.query();
		};

		// Find existing Gasto
		$scope.findOne = function() {
			$scope.gasto = Gastos.get({ 
				gastoId: $stateParams.gastoId
			});
		};

		$scope.getTotal = function () {
			var total = 0;
    		for(var i = 0; i < $scope.gastos.length; i++){
        		var gasto = $scope.gastos[i];
        		total += gasto.monto;
    		}
    		return total;
		};

		Socket.on('gasto', function() {
    		$scope.find();
		});
	}
]);