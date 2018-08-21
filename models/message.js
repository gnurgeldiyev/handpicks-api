const mongoose = require('mongoose');
const messageSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		lowercase: true
	},
	message: {
		type: String,
		required: true
	}
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } });
messageSchema.methods.messageToJson = function () {
	return {
		id: this._id,
		name: this.name,
		email: this.email,
		message: this.message,
		created: this.created,
	};
};
const Message = mongoose.model('Message', messageSchema);
module.exports = { Message };
