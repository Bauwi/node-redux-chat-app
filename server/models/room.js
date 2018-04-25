const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    trim: true
  },
  messages: [
    {
      type: {
        type: String,
        required: true,
        minLength: 1
      },
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
      coords: {
        type: Array,
        minLength: 2
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
      username: { type: String },
      socketId: { type: String },
      lastRoom: { type: String }
    }
  ],
  usersCount: {
    type: Number,
    default: 0
  }
});

RoomSchema.methods.addMessage = function (message) {
  this.messages = [...this.messages, message];

  return this.save()
    .then(() => this.update({ $inc: { messagesCount: 1 } }))
    .then(() => message);
};

RoomSchema.methods.getUsers = function () {
  return this.users;
};
RoomSchema.methods.getMessages = function () {
  return this.messages;
};
RoomSchema.methods.addUser = function (user) {
  const userInRoom = !this.users.map(user => user.username).includes(user.username);
  this.users = userInRoom ? [...this.users, user] : [...this.users];

  return this.save().then(() => this.update({ $inc: { usersCount: 1 } }));
};

RoomSchema.methods.removeUser = function (id) {
  return this.update({
    $pull: {
      users: { _id: id }
    },
    $inc: {
      usersCount: -1
    }
  });
};

const Room = mongoose.model('Room', RoomSchema);

module.exports = { Room };
