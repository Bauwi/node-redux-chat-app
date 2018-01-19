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
        minLength: 1,
        trim: true
      },
      createdAt: {
        type: Number
        // required: true
      },
      url: {
        type: String,
        minLength: 1,
        trim: true
      }
    }
  ],
  createdAt: {
    type: Number,
    required: true
  },
  messagesCount: {
    type: Number,
    default: 0
  },
  users: [
    {
      username: String
    }
  ]
});

RoomSchema.methods.addMessage = function(message) {
  this.messages = [...this.messages, message];

  return this.save()
    .then(() => this.update({ $inc: { messagesCount: 1 } }))
    .then(() => message);
};

RoomSchema.methods.getUsers = function() {
  return this.users;
};
RoomSchema.methods.getMessages = function() {
  return this.messages;
};
RoomSchema.methods.addUser = function(user) {
  console.log("addUser fired");
  this.users = [...this.users, user];
  console.log(this.users);

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
