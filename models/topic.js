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

const Topic = mongoose.model('Topic', topicSchema);

module.exports = { Topic };
