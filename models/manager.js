const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { tokenSalt } = require('../config/variables');
const managerSchema = mongoose.Schema({
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
  password: {
    type: String, 
    required: [true, "can't be blank"]
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
  role: {
    type: String,
    lowercase: true,
    default: 'editor'
  },
  token: {
    type: String,
    default: null
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});
managerSchema.methods.generateToken = function () {
  try {
    return jwt.sign({ id: this._id }, tokenSalt);
  } catch (err) {
    return false;
  }
}
managerSchema.methods.verifyToken = function () {
  try {
    const decoded = jwt.verify(this.token, tokenSalt);
    return decoded;
  } catch (err) {
    return false;
  }
}
managerSchema.methods.profileToJson = function () {
  return {
    id: this._id,
    username: this.username,
    name: this.name,
    lastname: this.lastname,
    role: this.role,
    created: this.created,
    token: this.token
  };
};
const Manager = mongoose.model('Manager', managerSchema);
module.exports = { Manager }