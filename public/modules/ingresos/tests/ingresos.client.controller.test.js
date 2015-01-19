'use strict';

(function() {
	// Ingresos Controller Spec
	describe('Ingresos Controller Tests', function() {
		// Initialize global variables
		var IngresosController,
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

			// Initialize the Ingresos controller.
			IngresosController = $controller('IngresosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ingreso object fetched from XHR', inject(function(Ingresos) {
			// Create sample Ingreso using the Ingresos service
			var sampleIngreso = new Ingresos({
				name: 'New Ingreso'
			});

			// Create a sample Ingresos array that includes the new Ingreso
			var sampleIngresos = [sampleIngreso];

			// Set GET response
			$httpBackend.expectGET('ingresos').respond(sampleIngresos);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ingresos).toEqualData(sampleIngresos);
		}));

		it('$scope.findOne() should create an array with one Ingreso object fetched from XHR using a ingresoId URL parameter', inject(function(Ingresos) {
			// Define a sample Ingreso object
			var sampleIngreso = new Ingresos({
				name: 'New Ingreso'
			});

			// Set the URL parameter
			$stateParams.ingresoId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ingresos\/([0-9a-fA-F]{24})$/).respond(sampleIngreso);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ingreso).toEqualData(sampleIngreso);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ingresos) {
			// Create a sample Ingreso object
			var sampleIngresoPostData = new Ingresos({
				name: 'New Ingreso'
			});

			// Create a sample Ingreso response
			var sampleIngresoResponse = new Ingresos({
				_id: '525cf20451979dea2c000001',
				name: 'New Ingreso'
			});

			// Fixture mock form input values
			scope.name = 'New Ingreso';

			// Set POST response
			$httpBackend.expectPOST('ingresos', sampleIngresoPostData).respond(sampleIngresoResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ingreso was created
			expect($location.path()).toBe('/ingresos/' + sampleIngresoResponse._id);
		}));

		it('$scope.update() should update a valid Ingreso', inject(function(Ingresos) {
			// Define a sample Ingreso put data
			var sampleIngresoPutData = new Ingresos({
				_id: '525cf20451979dea2c000001',
				name: 'New Ingreso'
			});

			// Mock Ingreso in scope
			scope.ingreso = sampleIngresoPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ingresos\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ingresos/' + sampleIngresoPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ingresoId and remove the Ingreso from the scope', inject(function(Ingresos) {
			// Create new Ingreso object
			var sampleIngreso = new Ingresos({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ingresos array and include the Ingreso
			scope.ingresos = [sampleIngreso];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ingresos\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleIngreso);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ingresos.length).toBe(0);
		}));
	});
}());