const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const apiKeySalt = process.env.APIKEY_SALT || 'SUPERP@SSWORD!';

const clientSchema = mongoose.Schema({
	private_name: {
		type: String,
		required: true,
		unique: true
  },
  public_name: {
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
  return jwt.sign({ id: this._id }, apiKeySalt);
}

clientSchema.methods.verifyApiKey = function (apiKey) {
  const decoded = jwt.verify(apiKey, apiKeySalt);
  return decoded;
}

clientSchema.methods.clientToJson = function () {
  return {
    id: this._id,
    name: this.public_name,
    created: this.created
  };
};
clientSchema.methods.keyToJson = function () {
  return {
    name: this.private_name,
    apiKey: this.api_key,
  };
};

const Client = mongoose.model('Client', clientSchema);

module.exports = { Client };
