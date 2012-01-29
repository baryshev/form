var
	async = require('async'),
	validator = require('validator'),
	path = require('path'),
	util = require('util');

var
	check = validator.check,
	sanitize = validator.sanitize;

module.exports.Validator = new validator.Validator();
module.exports.Filter = new validator.Filter();

var Form = function(fields) {
	this.fields = fields;
};

Form.prototype.addTask = function(tasks, data, field, handlers) {
	tasks.push(
		function(callback) {
			async.concatSeries(
				handlers,
				function(task, callback) {
					task(data, field, function(result) {
						if (result !== undefined) {
							callback(result, undefined);
						} else {
							callback(undefined, result);
						}
					});
				},
				function(error, results) {
					if (error !== undefined) {
						callback(undefined, [ error ]);
					} else {
						callback(undefined, results);
					}
				}
			);
		}
	);
};

Form.prototype.process = function(request, callback) {
	var data = {};
	var tasks = [];
	for (var field in this.fields) {
		data[field] = request[field];
		this.addTask(tasks, data, field, this.fields[field]);
	}
	async.parallel(tasks, function(error, results) {
		var errors = [];
		results.forEach(function(result) {
			errors = errors.concat(result);
		});
		if (errors.length > 0) {
			callback(errors, undefined);
		} else {
			callback(undefined, data);
		}
	});
};

module.exports.filter = function(filter) {
	var args = Array.prototype.slice.call(arguments, 1);
	return function(fields, field, callback) {
		var container = sanitize((fields[field] !== undefined) ? fields[field] : '');
		container.fields = fields;
		container.field = field;
		fields[field] = filter.apply(container, args);
		callback();
	};
};

module.exports.validator = function(validator, message) {
	var args = Array.prototype.slice.call(arguments, 2);
	return function(fields, field, callback) {
		var container = check((fields[field] !== undefined) ? fields[field] : '', message);
		container.fields = fields;
		container.field = field;
		try {
			validator.apply(container, args);
			callback();
		} catch(e) {
			var error = {};
			error[field] = e.message;
			callback(error);
		}
	};
};

module.exports.create = function(fields) {
	return new Form(fields);
};
