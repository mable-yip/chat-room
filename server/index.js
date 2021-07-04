const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const USER_JOINRED_EVENT = "userJoined";
const USER_LEFT_EVENT = "userLeft";
const GET_USERS_IN_ROOM = "userInRoom";

let usersInRooms = {}

io.on("connection", (socket) => {
  // Join a conversation
  const { roomId, userName } = socket.handshake.query;
  socket.join(roomId);

  if (!(roomId in usersInRooms)){
       usersInRooms[roomId] = {
       users: [userName]
    }
  } else {
      console.log(usersInRooms)
      usersInRooms[roomId].users.push(userName)
  }

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (messageObj) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, messageObj);
  });

  // Listen for user joined
  socket.on(USER_JOINRED_EVENT, (userName) => {
    io.in(roomId).emit(USER_JOINRED_EVENT, userName);
  });

  // Listen for user left
  socket.on(USER_LEFT_EVENT, (data) => {
    io.in(roomId).emit(USER_LEFT_EVENT, data.userName);
  });

  // Listen for GET_USERS_IN_ROOM
  socket.on(GET_USERS_IN_ROOM, () => {
      io.in(roomId).emit(GET_USERS_IN_ROOM, usersInRooms[roomId].users);
  });


  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(roomId);

    const oldUsers = usersInRooms[roomId].users
    const userIndex = oldUsers.findIndex(user => user === userName)
    if (userIndex !== -1) usersInRooms[roomId].users.splice(userIndex, 1)
    if (usersInRooms[roomId].users.length === 0) delete usersInRooms[roomId]
  })
});


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} User in rooms ${usersInRooms}`);
});