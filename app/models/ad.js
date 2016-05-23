var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var adSchema = mongoose.Schema({
	ad: {
		id: String,
		detail: String
	}
});

module.exports = mongoose.model('Ad', adSchema);