const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const unicornSchema = new Schema({
  name: {
    type: String
  },
  password: {
    type: String,
    index: true
  },
  email: {
    type: String
  },
  username: {
    type: String
  }
});

const Unicorn = mongoose.model('Unicorn', unicornSchema);

module.exports = Unicorn;
