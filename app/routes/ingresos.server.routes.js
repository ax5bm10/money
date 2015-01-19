'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var ingresos = require('../../app/controllers/ingresos.server.controller');

	// Ingresos Routes
	app.route('/ingresos')
		.get(ingresos.list)
		.post(users.requiresLogin, ingresos.create);

	app.route('/ingresos/:ingresoId')
		.get(ingresos.read)
		.put(users.requiresLogin, ingresos.hasAuthorization, ingresos.update)
		.delete(users.requiresLogin, ingresos.hasAuthorization, ingresos.delete);

	// Finish by binding the Ingreso middleware
	app.param('ingresoId', ingresos.ingresoByID);
};
