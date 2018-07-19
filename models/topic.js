const mongoose = require('mongoose');
// mongoose.set('debug', true);

const topicSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } });

topicSchema.methods.topicToJson = function () {
	return {
			id: this._id,
			title: this.title,
			url: this.url,
			description: this.description
	};
};

const Topic = mongoose.model('Topic', topicSchema);

module.exports = { Topic };
