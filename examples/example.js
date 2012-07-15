var form = require('./../index');

var fields = {
	name: [
		form.filter(form.Filter.trim),
		form.validator(form.Validator.notEmpty, 'Empty name'),
		form.validator(form.Validator.is, /[0-9]+/, 'Bad name')
	],
	text: [
		form.filter(form.Filter.trim),
		form.validator(form.Validator.notEmpty, 'Empty text'),
		form.validator(form.Validator.len, 30, 1000, 'Bad text length')
	]
};

var textForm = form.create(fields);

textForm.process({'text' : 'some short text', 'name': 'tester'}, function(error, data) {
	console.log(error);
	console.log(data);
});