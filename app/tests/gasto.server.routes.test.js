'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Gasto = mongoose.model('Gasto'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gasto;

/**
 * Gasto routes tests
 */
describe('Gasto CRUD tests', function() {
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

		// Save a user to the test db and create new Gasto
		user.save(function() {
			gasto = {
				name: 'Gasto Name'
			};

			done();
		});
	});

	it('should be able to save Gasto instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gasto
				agent.post('/gastos')
					.send(gasto)
					.expect(200)
					.end(function(gastoSaveErr, gastoSaveRes) {
						// Handle Gasto save error
						if (gastoSaveErr) done(gastoSaveErr);

						// Get a list of Gastos
						agent.get('/gastos')
							.end(function(gastosGetErr, gastosGetRes) {
								// Handle Gasto save error
								if (gastosGetErr) done(gastosGetErr);

								// Get Gastos list
								var gastos = gastosGetRes.body;

								// Set assertions
								(gastos[0].user._id).should.equal(userId);
								(gastos[0].name).should.match('Gasto Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gasto instance if not logged in', function(done) {
		agent.post('/gastos')
			.send(gasto)
			.expect(401)
			.end(function(gastoSaveErr, gastoSaveRes) {
				// Call the assertion callback
				done(gastoSaveErr);
			});
	});

	it('should not be able to save Gasto instance if no name is provided', function(done) {
		// Invalidate name field
		gasto.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gasto
				agent.post('/gastos')
					.send(gasto)
					.expect(400)
					.end(function(gastoSaveErr, gastoSaveRes) {
						// Set message assertion
						(gastoSaveRes.body.message).should.match('Please fill Gasto name');
						
						// Handle Gasto save error
						done(gastoSaveErr);
					});
			});
	});

	it('should be able to update Gasto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gasto
				agent.post('/gastos')
					.send(gasto)
					.expect(200)
					.end(function(gastoSaveErr, gastoSaveRes) {
						// Handle Gasto save error
						if (gastoSaveErr) done(gastoSaveErr);

						// Update Gasto name
						gasto.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gasto
						agent.put('/gastos/' + gastoSaveRes.body._id)
							.send(gasto)
							.expect(200)
							.end(function(gastoUpdateErr, gastoUpdateRes) {
								// Handle Gasto update error
								if (gastoUpdateErr) done(gastoUpdateErr);

								// Set assertions
								(gastoUpdateRes.body._id).should.equal(gastoSaveRes.body._id);
								(gastoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gastos if not signed in', function(done) {
		// Create new Gasto model instance
		var gastoObj = new Gasto(gasto);

		// Save the Gasto
		gastoObj.save(function() {
			// Request Gastos
			request(app).get('/gastos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gasto if not signed in', function(done) {
		// Create new Gasto model instance
		var gastoObj = new Gasto(gasto);

		// Save the Gasto
		gastoObj.save(function() {
			request(app).get('/gastos/' + gastoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gasto.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gasto instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gasto
				agent.post('/gastos')
					.send(gasto)
					.expect(200)
					.end(function(gastoSaveErr, gastoSaveRes) {
						// Handle Gasto save error
						if (gastoSaveErr) done(gastoSaveErr);

						// Delete existing Gasto
						agent.delete('/gastos/' + gastoSaveRes.body._id)
							.send(gasto)
							.expect(200)
							.end(function(gastoDeleteErr, gastoDeleteRes) {
								// Handle Gasto error error
								if (gastoDeleteErr) done(gastoDeleteErr);

								// Set assertions
								(gastoDeleteRes.body._id).should.equal(gastoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gasto instance if not signed in', function(done) {
		// Set Gasto user 
		gasto.user = user;

		// Create new Gasto model instance
		var gastoObj = new Gasto(gasto);

		// Save the Gasto
		gastoObj.save(function() {
			// Try deleting Gasto
			request(app).delete('/gastos/' + gastoObj._id)
			.expect(401)
			.end(function(gastoDeleteErr, gastoDeleteRes) {
				// Set message assertion
				(gastoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gasto error error
				done(gastoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Gasto.remove().exec();
		done();
	});
});