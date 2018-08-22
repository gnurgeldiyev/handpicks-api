const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
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
  summary: {
    type: String,
    maxlength: 500,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager'
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  },
  tags: [String],
  published: {
    type: Date,
    required: true,
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});
postSchema.index({
  link_title: 1,
  summary: 1
});
const Post = mongoose.model('Post', postSchema);
module.exports = { Post }