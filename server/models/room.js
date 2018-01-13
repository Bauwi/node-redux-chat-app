const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  messages: [
    {
      from: {
        type: String,
        required: true,
        minLength: 1
      },
      text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
      },
      createdAt: {
        type: Number
        // required: true
      },
      url: {
        type: Boolean
      }
    }
  ],
  users: [
    {
      name: String
    }
  ]
});

RoomSchema.methods.addMessage = function(message) {
  this.messages = [...this.messages, message];

  return this.save().then(() => message);
};

RoomSchema.methods.getUsers = function() {
  return this.users;
};
RoomSchema.methods.getMessages = function() {
  return this.messages;
};
RoomSchema.methods.addUser = function(user) {
  let { users } = this;
  users = [...users, user];

  return this.save().then(something => something);
};

RoomSchema.methods.removeUser = function(id) {
  return this.update({
    $pull: {
      users: {
        _id: id
      }
    }
  });
};

const Room = mongoose.model("Room", RoomSchema);

module.exports = { Room };
