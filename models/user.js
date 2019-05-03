const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
