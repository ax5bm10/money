'use strict';

(function() {
	// Gastos Controller Spec
	describe('Gastos Controller Tests', function() {
		// Initialize global variables
		var GastosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Gastos controller.
			GastosController = $controller('GastosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gasto object fetched from XHR', inject(function(Gastos) {
			// Create sample Gasto using the Gastos service
			var sampleGasto = new Gastos({
				name: 'New Gasto'
			});

			// Create a sample Gastos array that includes the new Gasto
			var sampleGastos = [sampleGasto];

			// Set GET response
			$httpBackend.expectGET('gastos').respond(sampleGastos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gastos).toEqualData(sampleGastos);
		}));

		it('$scope.findOne() should create an array with one Gasto object fetched from XHR using a gastoId URL parameter', inject(function(Gastos) {
			// Define a sample Gasto object
			var sampleGasto = new Gastos({
				name: 'New Gasto'
			});

			// Set the URL parameter
			$stateParams.gastoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gastos\/([0-9a-fA-F]{24})$/).respond(sampleGasto);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gasto).toEqualData(sampleGasto);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Gastos) {
			// Create a sample Gasto object
			var sampleGastoPostData = new Gastos({
				name: 'New Gasto'
			});

			// Create a sample Gasto response
			var sampleGastoResponse = new Gastos({
				_id: '525cf20451979dea2c000001',
				name: 'New Gasto'
			});

			// Fixture mock form input values
			scope.name = 'New Gasto';

			// Set POST response
			$httpBackend.expectPOST('gastos', sampleGastoPostData).respond(sampleGastoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gasto was created
			expect($location.path()).toBe('/gastos/' + sampleGastoResponse._id);
		}));

		it('$scope.update() should update a valid Gasto', inject(function(Gastos) {
			// Define a sample Gasto put data
			var sampleGastoPutData = new Gastos({
				_id: '525cf20451979dea2c000001',
				name: 'New Gasto'
			});

			// Mock Gasto in scope
			scope.gasto = sampleGastoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/gastos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gastos/' + sampleGastoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gastoId and remove the Gasto from the scope', inject(function(Gastos) {
			// Create new Gasto object
			var sampleGasto = new Gastos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gastos array and include the Gasto
			scope.gastos = [sampleGasto];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gastos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGasto);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gastos.length).toBe(0);
		}));
	});
}());