const mongoose = require('mongoose');

const linkSchema = mongoose.Schema({
	link_hostname: {
		type: String,
		lowercase: true,
		required: true,
		trim: true
	},
	link_url: {
		type: String,
		required: true
	},
	link_thumbnail: {
		type: String,
		required: true
	},
	link_title: {
		type: String,
		required: true
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	topic: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Topic'
	},
	tags: [String]
}, {
	timestamps: {
		createdAt: 'created',
		updatedAt: 'updated'
	}
});

linkSchema.index({
	link_title: 1
});

linkSchema.methods.linkToJson = function () {
  return {
    id: this._id,
    hostname: this.link_hostname,
    url: this.link_url,
    thumbnail: this.link_thumbnail,
    title: this.link_title,
    tags: this.tags || ''
  };
};

const Link = mongoose.model('Link', linkSchema);

module.exports = { Link } 