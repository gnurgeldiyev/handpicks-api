const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "can't be blank"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9]+$/, 'is invalid']
  },
  email: {
    type: String,
    required: [true, "can't be blank"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  bio: {
    type: String,
    maxlength: 150
  },
  avatar: String,
  role: {
    type: String,
    lowercase: true,
    default: 'user'
  },
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