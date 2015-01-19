'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ingreso Schema
 */
var IngresoSchema = new Schema({
	motivo: {
		type: String,
		default: '',
		trim: true
	},
	monto: {
		type: Number,
		default: 0,
		required: 'Ingrese un monto para el ingreso',
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Ingreso', IngresoSchema);