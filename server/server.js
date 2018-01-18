require("./config/config");
require("./db/mongoose");

const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const _ = require("lodash");

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
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
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
/*Serving App with Client-side routing                          */
/****************************************************************/

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
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
    console.log(params);
    users.addUser(socket.id, params.name, params.room);

    io
      .to(params.room)
      .emit("updateUserList", _.uniq(users.getUserList(params.room)));
    console.log(users.getUserList(params.room));
    socket.emit(
      "newMessage",
      generateMessage("Admin", "Welcome to the chat app.")
    );

    socket.broadcast
      .to(params.room)
      .emit("newMessage", generateMessage("Admin", `${params.name} joined.`));

    callback();
  });

  socket.on("enterRoom", roomName => {
    const roomItem = new Room({
      name: roomName
    });
    Room.findOne(
      {
        name: roomName
      },
      (err, room) => {
        if (err) {
          return console.log("Something went wrong.");
        }
        if (!room) {
          roomItem.save().then(addedRoom => {
            console.log(
              `Room : ${addedRoom.name} room added. Its id is ${addedRoom._id}`
            );
            io.to(addedRoom.name).emit("roomReady", addedRoom);
          });
        } else {
          io.to(room.name).emit("roomReady", room);
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
    console.log(room);
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
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io
        .to(user.room)
        .emit("newMessage", generateMessage("Admin", `${user.name} has left.`));
    }
  });
});

/****************************************************************/
/*Authentication                                                */
/****************************************************************/

/* Create Account*/

app.post("/users", (req, res) => {
  console.log("create user", req.body);
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
        console.log("token:", token, "User: ", user);
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

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

/* Remove token on log out */

app.delete("/users/me/token", authenticate, (req, res) => {
  console.log("request", req);
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send();
    },
    () => {
      res.status(400).send();
    }
  );
});

server.listen(port, () => {
  console.log(`Started server at port ${port}`);
});
