const mongoose = require('mongoose');

const topicFollowSchema = mongoose.Schema({
	follower: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	followee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Topic'
	},
}, {
	timestamps: {
		createdAt: 'created',
		updatedAt: 'updated'
	}
});

topicFollowSchema.index({
	follower: 1,
	followee: 1
});

const TopicFollow = mongoose.model('TopicFollow', topicFollowSchema);

module.exports = { TopicFollow } 