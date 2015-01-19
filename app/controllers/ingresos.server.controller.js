'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ingreso = mongoose.model('Ingreso'),
	_ = require('lodash');

/**
 * Create a Ingreso
 */
exports.create = function(req, res) {
	var ingreso = new Ingreso(req.body);
	ingreso.user = req.user;

	ingreso.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
			socketio.sockets.emit('ingreso'); // emit an event for all connected clients
			res.jsonp(ingreso);
		}
	});
};

/**
 * Show the current Ingreso
 */
exports.read = function(req, res) {
	res.jsonp(req.ingreso);
};

/**
 * Update a Ingreso
 */
exports.update = function(req, res) {
	var ingreso = req.ingreso ;

	ingreso = _.extend(ingreso , req.body);

	ingreso.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio');
			socketio.sockets.emit('ingreso');
			res.jsonp(ingreso);
		}
	});
};

/**
 * Delete an Ingreso
 */
exports.delete = function(req, res) {
	var ingreso = req.ingreso ;

	ingreso.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio');
			socketio.sockets.emit('ingreso');
			res.jsonp(ingreso);
		}
	});
};

/**
 * List of Ingresos
 */
exports.list = function(req, res) { 
	Ingreso.find().sort('-created').populate('user', 'displayName').exec(function(err, ingresos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ingresos);
		}
	});
};

/**
 * Ingreso middleware
 */
exports.ingresoByID = function(req, res, next, id) { 
	Ingreso.findById(id).populate('user', 'displayName').exec(function(err, ingreso) {
		if (err) return next(err);
		if (! ingreso) return next(new Error('Failed to load Ingreso ' + id));
		req.ingreso = ingreso ;
		next();
	});
};

/**
 * Ingreso authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ingreso.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
