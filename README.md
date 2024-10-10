# Form - Node.js Form Validation and Filtering Library

`form` is a lightweight Node.js library designed for form validation and data filtering. It leverages `async` to handle validation and filtering tasks asynchronously and uses `validator` to check and sanitize form inputs.

## Features

- **Customizable Form Fields**: Easily define rules for validating and filtering individual form fields.
- **Asynchronous Execution**: Uses async series and parallel execution to process form fields without blocking.
- **Built-in Validators and Filters**: Utilizes `validator` for common validation and filtering tasks (e.g., checking if a field is empty, matching a regex pattern, trimming, etc.).
- **Error Handling**: Automatically collects and returns errors during validation.

## Installation

```bash
npm install form
```

## Usage

### Example

```javascript
const form = require('form');

// Define validation rules and filters for fields
const fields = {
  name: [
    form.filter(form.Filter.trim), // Trim whitespace
    form.validator(form.Validator.notEmpty, 'Empty name'), // Name cannot be empty
    form.validator(form.Validator.is, /[0-9]+/, 'Bad name') // Must contain numbers
  ],
  text: [
    form.filter(form.Filter.trim), // Trim whitespace
    form.validator(form.Validator.notEmpty, 'Empty text'), // Text cannot be empty
    form.validator(form.Validator.len, 30, 1000, 'Bad text length') // Text must be between 30 and 1000 characters
  ]
};

// Create a form instance with defined fields
const textForm = form.create(fields);

// Process incoming form data
textForm.process({ text: 'some short text', name: 'tester' }, (error, data) => {
  if (error) {
    console.log('Errors:', error); // Print any validation errors
  } else {
    console.log('Valid data:', data); // Print valid form data
  }
});
```

### Defining Form Fields

Fields are defined as an object where each key is the name of the form field and its value is an array of filters and validators applied in sequence.

- **Filters**: Functions that modify the field's data (e.g., trimming whitespace, converting to lowercase).
- **Validators**: Functions that ensure the field's data meets specific criteria (e.g., not empty, matching a regex).

#### Example

```javascript
const fields = {
  email: [
    form.filter(form.Filter.trim), // Trim whitespace from the email
    form.validator(form.Validator.isEmail, 'Invalid email address') // Ensure the field is a valid email address
  ],
  age: [
    form.filter(form.Filter.toInt), // Convert age to an integer
    form.validator(form.Validator.isInt, { min: 18 }, 'Must be 18 or older') // Ensure age is at least 18
  ]
};
```

### Processing Form Data

The `process` function validates and filters incoming data, returning the sanitized data or any validation errors.

```javascript
textForm.process({ field1: 'some input' }, function (error, data) {
  if (error) {
    console.log('Validation errors:', error);
  } else {
    console.log('Sanitized data:', data);
  }
});
```

### Creating Custom Filters and Validators

You can also create custom filters and validators.

#### Custom Filter Example

```javascript
form.filter(function (fields, field, callback) {
  fields[field] = fields[field].toUpperCase(); // Convert input to uppercase
  callback();
});
```

#### Custom Validator Example

```javascript
form.validator(function (fields, field, callback) {
  if (fields[field] !== 'customValue') {
    callback('Invalid value');
  } else {
    callback();
  }
}, 'Invalid value');
```

## API

### `form.create(fields)`

Creates a new `Form` instance with the given fields and rules.

- `fields`: An object where each key represents a form field, and its value is an array of filters and validators.

### `form.process(request, callback)`

Processes incoming form data.

- `request`: The form data to validate and filter (usually from an HTTP request).
- `callback(error, data)`: A callback that receives any validation errors and the sanitized form data.

### Filters

- `form.Filter.trim`: Trims whitespace from a string.
- `form.Filter.toInt`: Converts a string to an integer.

### Validators

- `form.Validator.notEmpty`: Ensures the field is not empty.
- `form.Validator.isEmail`: Validates that the field contains a valid email address.
- `form.Validator.isInt(options)`: Ensures the field is an integer (with optional range options).
- `form.Validator.len(min, max)`: Ensures the field length is between `min` and `max`.
