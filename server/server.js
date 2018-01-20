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

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Headers", "x-auth, content-type");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

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
      (err, room) => {
        if (err) {
          return err;
        }

        // Create a room if it does not already exist.
        if (!room) {
          roomItem.save().then(addedRoom => {
            // InitialLoad ready to be dispatched with addedRoom.
            socket.emit("roomReady", addedRoom);

            // Add user in room in db.
            addedRoom.addUser({
              ...user,
              socketId: socket.id,
              lastRoom: addedRoom._id
            });

            // Add user in room in client.
            io.to(roomName).emit("newUserInRoom", user);
          });

          // If Room already exists, initialLoad ready with room. Add user to db and client.
        } else {
          socket.emit("roomReady", room);
          room.addUser({ ...user, socketId: socket.id, lastRoom: room._id });
          io.to(roomName).emit("newUserInRoom", user);
        }
      }
    );
  });

  socket.on("createMessage", (message, room, callback) => {
    const user = users.getUser(socket.id);
    return Room.findById(room._id)
      .then(resRoom => {
        if (resRoom && isRealString(message.text)) {
          return resRoom.addMessage(generateMessage(user.name, message.text));
        } else {
          return Promise.reject();
        }
      })
      .then(message => {
        io
          .to(room.name)
          .emit("newMessage", generateMessage(user.name, message.text));
      })
      .catch(e => console.log(e));

    callback();
  });

  socket.on("createLocationMessage", (coords, room, username) => {
    return Room.findById(room._id)
      .then(resRoom => {
        if (resRoom && coords.latitude && coords.longitude) {
          return resRoom.addMessage(
            generateLocationMessage(username, coords.latitude, coords.longitude)
          );
        } else {
          return Promise.reject();
        }
      })
      .then(message => {
        io
          .to(room.name)
          .emit(
            "newLocationMessage",
            generateLocationMessage(username, coords.latitude, coords.longitude)
          );
      });
  });

  socket.on("disconnect", () => {
    // Find room where user is disconnecting from.
    return Room.findOne({ users: { $elemMatch: { socketId: socket.id } } })
      .then(resRoom => {
        // Find the user in the room.
        const user = resRoom.users.filter(
          user => user.socketId === socket.id
        )[0];

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
        return resRoom.removeUser(user._id);
      })
      .catch(e => console.log(e));
  });
});

/****************************************************************/
/*Authentication                                                */
/****************************************************************/

/* Create Account*/

app.post("/users", (req, res) => {
  const user = new User(_.pick(req.body, ["email", "password", "username"]));
  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header("x-auth", token).send(user);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

/* Log in */

app.post("/users/login", (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      user.generateAuthToken().then(token => {
        res.header("x-auth", token).send({
          _id: user._id,
          email: user.email,
          username: user.username,
          token
        });
      });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

/* Get the rooms with the most messages */

app.get("/rooms/top5", authenticate, (req, res) => {
  Room.find({})
    .sort({ messagesCount: -1 })
    .limit(5)
    .then(top5 => {
      res.status(200).send(top5);
    });
});

/* Get the last room created */
app.get("/rooms/last", authenticate, (req, res) => {
  Room.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .then(last => {
      res.status(200).send(last);
    });
});

app.get("/rooms/crowded", authenticate, (req, res) => {
  Room.find({})
    .sort({ usersCount: -1 })
    .limit(5)
    .then(crowded => {
      res.status(200).send(crowded);
    });
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

/* Remove token on log out */

app.delete("/users/me/token", authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send();
    },
    () => {
      res.status(400).send();
    }
  );
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
