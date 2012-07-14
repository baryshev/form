var form = require('./../index');

var fields = {
	text: [
		form.filter(form.Filter.trim),
		form.validator(form.Validator.notEmpty, 'Empty text'),
		form.validator(form.Validator.len, 30, 1000, 'Bad text length')
	],
	name: [
		form.filter(form.Filter.trim),
		form.validator(form.Validator.notEmpty, 'Empty name')
	]
};

var textForm = form.create(fields);

textForm.process({'text' : 'some short text', 'name': 'tester'}, function(error, data) {
	console.log(error);
	console.log(data);
});