'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Gasto Schema
 */
var GastoSchema = new Schema({
	motivo: {
		type: String,
		default: '',
		required: 'Ingrese un motivo',
		trim: true
	},
	monto: {
		type: Number,
		default: 0,
		required: 'Ingrese un monto'
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

mongoose.model('Gasto', GastoSchema);