'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location',
	function($scope, Authentication, $location) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		//Si no se esta logueado todavia redirige a la pagina de login
		if (!$scope.authentication.user) $location.path('/signin');
	}
]);