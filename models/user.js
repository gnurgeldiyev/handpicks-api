const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'SUPERP@SSWORD!';

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

userSchema.methods.generateJWT = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 365);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000, 10),
  }, secret);
};

userSchema.methods.verifyJWT = function (token) {
  jwt.verify(token, secret, function (err, decoded) {
    if (err) { return false; }
    return decoded;
  });
}

userSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    name: this.name,
    lastname: this.lastname,
    token: this.generateJWT(),
    bio: this.bio,
    avatar: this.avatar
  };
};

userSchema.methods.profileToJson = function () {
  return {
    id: this._id,
    username: this.username,
    name: this.name,
    lastname: this.lastname,
    bio: this.bio,
    avatar: this.avatar || ''
  };
};


const User = mongoose.model('User', userSchema);

module.exports = { User }