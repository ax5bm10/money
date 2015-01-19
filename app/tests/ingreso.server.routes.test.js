'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ingreso = mongoose.model('Ingreso'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ingreso;

/**
 * Ingreso routes tests
 */
describe('Ingreso CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Ingreso
		user.save(function() {
			ingreso = {
				name: 'Ingreso Name'
			};

			done();
		});
	});

	it('should be able to save Ingreso instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ingreso
				agent.post('/ingresos')
					.send(ingreso)
					.expect(200)
					.end(function(ingresoSaveErr, ingresoSaveRes) {
						// Handle Ingreso save error
						if (ingresoSaveErr) done(ingresoSaveErr);

						// Get a list of Ingresos
						agent.get('/ingresos')
							.end(function(ingresosGetErr, ingresosGetRes) {
								// Handle Ingreso save error
								if (ingresosGetErr) done(ingresosGetErr);

								// Get Ingresos list
								var ingresos = ingresosGetRes.body;

								// Set assertions
								(ingresos[0].user._id).should.equal(userId);
								(ingresos[0].name).should.match('Ingreso Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Ingreso instance if not logged in', function(done) {
		agent.post('/ingresos')
			.send(ingreso)
			.expect(401)
			.end(function(ingresoSaveErr, ingresoSaveRes) {
				// Call the assertion callback
				done(ingresoSaveErr);
			});
	});

	it('should not be able to save Ingreso instance if no name is provided', function(done) {
		// Invalidate name field
		ingreso.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ingreso
				agent.post('/ingresos')
					.send(ingreso)
					.expect(400)
					.end(function(ingresoSaveErr, ingresoSaveRes) {
						// Set message assertion
						(ingresoSaveRes.body.message).should.match('Please fill Ingreso name');
						
						// Handle Ingreso save error
						done(ingresoSaveErr);
					});
			});
	});

	it('should be able to update Ingreso instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ingreso
				agent.post('/ingresos')
					.send(ingreso)
					.expect(200)
					.end(function(ingresoSaveErr, ingresoSaveRes) {
						// Handle Ingreso save error
						if (ingresoSaveErr) done(ingresoSaveErr);

						// Update Ingreso name
						ingreso.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Ingreso
						agent.put('/ingresos/' + ingresoSaveRes.body._id)
							.send(ingreso)
							.expect(200)
							.end(function(ingresoUpdateErr, ingresoUpdateRes) {
								// Handle Ingreso update error
								if (ingresoUpdateErr) done(ingresoUpdateErr);

								// Set assertions
								(ingresoUpdateRes.body._id).should.equal(ingresoSaveRes.body._id);
								(ingresoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Ingresos if not signed in', function(done) {
		// Create new Ingreso model instance
		var ingresoObj = new Ingreso(ingreso);

		// Save the Ingreso
		ingresoObj.save(function() {
			// Request Ingresos
			request(app).get('/ingresos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Ingreso if not signed in', function(done) {
		// Create new Ingreso model instance
		var ingresoObj = new Ingreso(ingreso);

		// Save the Ingreso
		ingresoObj.save(function() {
			request(app).get('/ingresos/' + ingresoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', ingreso.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Ingreso instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Ingreso
				agent.post('/ingresos')
					.send(ingreso)
					.expect(200)
					.end(function(ingresoSaveErr, ingresoSaveRes) {
						// Handle Ingreso save error
						if (ingresoSaveErr) done(ingresoSaveErr);

						// Delete existing Ingreso
						agent.delete('/ingresos/' + ingresoSaveRes.body._id)
							.send(ingreso)
							.expect(200)
							.end(function(ingresoDeleteErr, ingresoDeleteRes) {
								// Handle Ingreso error error
								if (ingresoDeleteErr) done(ingresoDeleteErr);

								// Set assertions
								(ingresoDeleteRes.body._id).should.equal(ingresoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Ingreso instance if not signed in', function(done) {
		// Set Ingreso user 
		ingreso.user = user;

		// Create new Ingreso model instance
		var ingresoObj = new Ingreso(ingreso);

		// Save the Ingreso
		ingresoObj.save(function() {
			// Try deleting Ingreso
			request(app).delete('/ingresos/' + ingresoObj._id)
			.expect(401)
			.end(function(ingresoDeleteErr, ingresoDeleteRes) {
				// Set message assertion
				(ingresoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Ingreso error error
				done(ingresoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Ingreso.remove().exec();
		done();
	});
});