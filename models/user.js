const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "can't be blank"],
    trim: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "can't be blank"],
    trim: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 64
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 64
  },
  bio: {
    type: String,
    maxlength: 128
  },
  avatar: String,
  token: {
    type: String,
    default: null
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

userSchema.index({
  username: 1
});

userSchema.methods.profileToJson = function () {
  return {
    id: this._id,
    username: this.username,
    name: this.name,
    lastname: this.lastname,
    bio: this.bio,
    avatar: this.avatar
  };
};

const User = mongoose.model('User', userSchema);

module.exports = { User }