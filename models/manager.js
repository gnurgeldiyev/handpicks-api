const mongoose = require('mongoose');

const managerSchema = mongoose.Schema({
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
  password: {
    type: String,
    required: [true, "can't be blank"]
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
  role: {
    type: String,
    lowercase: true,
    default: 'editor'
  },
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
});

managerSchema.methods.profileToJson = function () {
  return {
    id: this._id,
    username: this.username,
    name: this.name,
    lastname: this.lastname,
    role: this.role,
    created: this.created
  };
};

const Manager = mongoose.model('Manager', managerSchema);

module.exports = { Manager }