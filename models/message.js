const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const messageSchema = new Schema({
  email: {
    type: String
  },
  message: {
    type: String
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
