const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { Room } = require("./../../models/room");
const { User } = require("./../../models/user");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();
const userFourId = new ObjectID();

const users = [
  {
    _id: userOneId,
    email: "andrew@example.com",
    password: "userOnePass",
    username: "geronimo",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userOneId, access: "auth" }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: "jen@example.com",
    password: "userTwoPass",
    username: "marie curie",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userTwoId, access: "auth" }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  },
  {
    _id: userThreeId,
    email: "riri@example.com",
    password: "userThreePass",
    username: "riri",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userTwoId, access: "auth" }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  },
  {
    _id: userFourId,
    email: "fifi@example.com",
    password: "userFourPass",
    username: "fifi",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign({ _id: userTwoId, access: "auth" }, process.env.JWT_SECRET)
          .toString()
      }
    ]
  }
];

const rooms = [
  {
    _id: new ObjectID(),
    name: "peaky blinders",
    createdAt: 123,
    usersCount: 1,
    users: [users[0]],
    messagesCount: 3,
    messages: [],
    __v: 1
  },
  {
    _id: new ObjectID(),
    name: "matrix",
    createdAt: 0,
    usersCount: 2,
    users: [users[0], users[1]],
    messagesCount: 5,
    messages: [],
    __v: 1
  },
  {
    _id: new ObjectID(),
    name: "dark",
    createdAt: 1234,
    usersCount: 3,
    users: [users[0], users[1], users[3]],
    messagesCount: 4,
    messages: [],
    __v: 1
  },
  {
    _id: new ObjectID(),
    name: "stranger things",
    createdAt: 0,
    usersCount: 0,
    users: [],
    messagesCount: 12,
    messages: [],
    __v: 1
  },
  {
    _id: new ObjectID(),
    name: "casa de papel",
    createdAt: 0,
    usersCount: 4,
    users: [users[0], users[1], users[2], users[3]],
    messagesCount: 1,
    messages: [],
    __v: 1
  },
  {
    _id: new ObjectID(),
    name: "true detective",
    createdAt: 0,
    usersCount: 0,
    users: [],
    messagesCount: 25,
    messages: [],
    __v: 1
  }
];

const populateRooms = async () => {
  await Room.remove({});
  await Room.insertMany(rooms);
};

const populateUsers = async () => {
  await User.remove({});

  const userOne = new User(users[0]).save();
  const userTwo = new User(users[1]).save();

  await Promise.all([userOne, userTwo]);
};

module.exports = { rooms, populateRooms, users, populateUsers };
