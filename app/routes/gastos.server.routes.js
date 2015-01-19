'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gastos = require('../../app/controllers/gastos.server.controller');

	// Gastos Routes
	app.route('/gastos')
		.get(gastos.list)
		.post(users.requiresLogin, gastos.create);

	app.route('/gastos/:gastoId')
		.get(gastos.read)
		.put(users.requiresLogin, gastos.hasAuthorization, gastos.update)
		.delete(users.requiresLogin, gastos.hasAuthorization, gastos.delete);

	// Finish by binding the Gasto middleware
	app.param('gastoId', gastos.gastoByID);
};
