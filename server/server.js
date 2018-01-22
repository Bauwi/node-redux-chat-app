require("./config/config");
require("./db/mongoose");

const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const _ = require("lodash");
const moment = require("moment");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation.js");
const { Users } = require("./utils/users");
const { Room } = require("./models/room");
const { User } = require("./models/user");
const { authenticate } = require("./middleware/authenticate");

const bodyParser = require("body-parser");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();
app.use(bodyParser.json());

app.use(express.static(publicPath));

/****************************************************************/
/*Add Headers for developpment mode                             */
/****************************************************************/

// app.use(function(req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "x-auth, content-type");

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // Pass to next layer of middleware
//   next();
// });

/****************************************************************/
/*Chat sockets                                                  */
/****************************************************************/

io.on("connection", socket => {
  socket.on("join", (params, callback) => {
    //User joins a room.
    socket.join(params.room);

    users.removeUser(socket.id);

    // Add user to room in db.
    users.addUser(socket.id, params.name, params.room);

    // Emit Welcome message
    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app.")
    );

    // Notify to everyone in room that user joined.
    socket.broadcast
      .to(params.room)
      .emit("newMessage", generateMessage("Admin", `${params.name} joined.`));

    callback();
  });

  socket.on("enterRoom", (roomName, user) => {
    // New Room instance.
    const roomItem = new Room({
      name: roomName,
      createdAt: moment().valueOf()
    });

    // Look for an existing room with the same name.
    Room.findOne(
      {
        name: roomName
      },
      async (err, room) => {
        if (err) {
          return err;
        }

        // Create a room if it does not already exist.
        if (!room) {
          const addedRoom = await roomItem.save();
          socket.emit("roomReady", addedRoom);
          addedRoom.addUser({
            ...user,
            socketId: socket.id,
            lastRoom: addedRoom._id
          });
          io.to(roomName).emit("newUserInRoom", user);
        } else {
          socket.emit("roomReady", room);
          room.addUser({ ...user, socketId: socket.id, lastRoom: room._id });
          io.to(roomName).emit("newUserInRoom", user);
        }
      }
    );
  });

  socket.on("createMessage", async (message, room, callback) => {
    const user = users.getUser(socket.id);
    try {
      const resRoom = await Room.findById(room._id);
      let tempMessage;
      if (resRoom && isRealString(message.text)) {
        tempMessage = await resRoom.addMessage(
          generateMessage(user.name, message.text)
        );
      } else {
        return Promise.reject();
      }

      io
        .to(room.name)
        .emit("newMessage", generateMessage(user.name, tempMessage.text));
    } catch (error) {
      console.log(error);
    }

    callback();
  });

  socket.on("createLocationMessage", async (coords, room, username) => {
    try {
      const resRoom = await Room.findById(room._id);
      let tempMessage;
      if (resRoom && coords.latitude && coords.longitude) {
        tempMessage = await resRoom.addMessage(
          generateLocationMessage(username, coords.latitude, coords.longitude)
        );
      } else {
        return Promise.reject();
      }
      io
        .to(room.name)
        .emit(
          "newLocationMessage",
          generateLocationMessage(username, coords.latitude, coords.longitude)
        );
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", async () => {
    // Find room where user is disconnecting from.
    const resRoom = await Room.findOne({
      users: { $elemMatch: { socketId: socket.id } }
    });

    // Find the user in the room.
    const user = resRoom.users.filter(user => user.socketId === socket.id)[0];

    // Emit event to update the state of all user in that room.
    io.to(resRoom.name).emit("userLeftRoom", user.username);

    // Notify that a user left.
    io
      .to(resRoom.name)
      .emit(
        "newMessage",
        generateMessage("Admin", `${user.username} has left.`)
      );

    // Remove user from db
    //TODO async for this.
    return resRoom.removeUser(user._id);
  });
});

/****************************************************************/
/*Authentication                                                */
/****************************************************************/

/* Create Account*/

app.post("/users", async (req, res) => {
  const user = new User(_.pick(req.body, ["email", "password", "username"]));
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

/* Log in */

app.post("/users/login", async (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);

  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send({
      _id: user._id,
      email: user.email,
      username: user.username,
      token
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

/* Get the rooms with the most messages */

app.get("/rooms/top5", authenticate, async (req, res) => {
  try {
    const top5 = await Room.find({})
      .sort({ messagesCount: -1 })
      .limit(5);

    res.status(200).send(top5);
  } catch (error) {
    res.status(400).send(error);
  }
});

/* Get the last room created */
app.get("/rooms/last", authenticate, async (req, res) => {
  try {
    const last = await Room.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).send(last);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/rooms/crowded", authenticate, async (req, res) => {
  try {
    const crowded = await Room.find({})
      .sort({ usersCount: -1 })
      .limit(5);
    res.status(200).send(crowded);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

/* Remove token on log out */

app.delete("/users/me/token", authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

/****************************************************************/
/*Serving App with Client-side routing                          */
/****************************************************************/

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

server.listen(port, () => {
  console.log(`Started server at port ${port}`);
});

module.exports = { app };
