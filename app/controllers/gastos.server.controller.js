'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Gasto = mongoose.model('Gasto'),
	_ = require('lodash');

/**
 * Create a Gasto
 */
exports.create = function(req, res) {
	var gasto = new Gasto(req.body);
	gasto.user = req.user;

	gasto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio');
			socketio.sockets.emit('gasto');
			res.jsonp(gasto);
		}
	});
};

/**
 * Show the current Gasto
 */
exports.read = function(req, res) {
	res.jsonp(req.gasto);
};

/**
 * Update a Gasto
 */
exports.update = function(req, res) {
	var gasto = req.gasto ;

	gasto = _.extend(gasto , req.body);

	gasto.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio');
			socketio.sockets.emit('gasto');
			res.jsonp(gasto);
		}
	});
};

/**
 * Delete an Gasto
 */
exports.delete = function(req, res) {
	var gasto = req.gasto ;

	gasto.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio');
			socketio.sockets.emit('gasto');
			res.jsonp(gasto);
		}
	});
};

/**
 * List of Gastos
 */
exports.list = function(req, res) { 
	Gasto.find().sort('-created').populate('user', 'displayName').exec(function(err, gastos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gastos);
		}
	});
};

/**
 * Gasto middleware
 */
exports.gastoByID = function(req, res, next, id) { 
	Gasto.findById(id).populate('user', 'displayName').exec(function(err, gasto) {
		if (err) return next(err);
		if (! gasto) return next(new Error('Failed to load Gasto ' + id));
		req.gasto = gasto ;
		next();
	});
};

/**
 * Gasto authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.gasto.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
