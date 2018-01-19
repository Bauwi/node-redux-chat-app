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
    // if (!isRealString(params.name) || !isRealString(params.room)) {
    //   return callback("name and room name required.");
    // }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app.")
    );

    socket.broadcast
      .to(params.room)
      .emit("newMessage", generateMessage("Admin", `${params.name} joined.`));

    callback();
  });

  socket.on("enterRoom", (roomName, user) => {
    const roomItem = new Room({
      name: roomName,
      createdAt: moment().valueOf()
    });
    Room.findOne(
      {
        name: roomName
      },
      (err, room) => {
        if (err) {
          return err;
        }
        if (!room) {
          roomItem.save().then(addedRoom => {
            socket.emit("roomReady", addedRoom);
            addedRoom.addUser({
              ...user,
              socketId: socket.id,
              lastRoom: addedRoom._id
            });
            io.to(roomName).emit("newUserInRoom", user);
          });
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
    return Room.findOne({ users: { $elemMatch: { socketId: socket.id } } })
      .then(resRoom => {
        const user = resRoom.users.filter(
          user => user.socketId === socket.id
        )[0];
        io.to(resRoom.name).emit("userLeftRoom", user.username);
        io
          .to(resRoom.name)
          .emit(
            "newMessage",
            generateMessage("Admin", `${user.username} has left.`)
          );

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
