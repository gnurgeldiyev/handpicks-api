const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  link_domain: {
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
  summary: {
    type: String,
    maxlength: 300,
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

postSchema.index({
  summary: 1,
  tags: 1
});

const Post = mongoose.model('Post', postSchema);

module.exports = {
  Post
}