require("./config/config");
require("./db/mongoose");

const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation.js");
const { Users } = require("./utils/users");
const { Room } = require("./models/room");

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected.");

  socket.on("join", (params, callback) => {
    // if (!isRealString(params.name) || !isRealString(params.room)) {
    //   return callback("name and room name required.");
    // }

    console.log("user joined");
    console.log(params);
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));

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
    Room.findOne({ name: roomName }, (err, room) => {
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

      console.log("room: ", room);
    });
  });

  socket.on("createMessage", (message, room, callback) => {
    console.log("the room is on fire", room);
    const user = users.getUser(socket.id);
    // const user = {
    //   name: "some name"
    // };
    console.log("roomee: ", room.name);
    return Room.findById(room._id)
      .then(resRoom => {
        // console.log("resRoom._id", resRoom._id);
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

  // socket.on("createLocationMessage", coords => {
  //   io.emit(
  //     "newLocationMessage",
  //     generateLocationMessage("Admin", coords.latitude, coords.longitude)
  //   );
  // });

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

server.listen(port, () => {
  console.log(`Started server at port ${port}`);
});
