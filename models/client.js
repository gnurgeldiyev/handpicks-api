const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'SUPERP@SSWORD!';
// mongoose.set('debug', true);

const clientSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	api_key: {
		type: String,
    unique: true,
    default: null
	},
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } });

clientSchema.methods.generateApiKey = function() {
  return jwt.sign({ id: this._id }, secret);
}

clientSchema.methods.verifyApiKey = function (apiKey) {
  jwt.verify(apiKey, secret, function (err, decoded) {
    if (err) { return false; }
    return decoded;
  });
}

const Client = mongoose.model('Client', clientSchema);

module.exports = { Client };
