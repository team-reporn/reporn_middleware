let roomsIds = ["elleBaise"];
let s4 = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("connection of a user");
    socket.on("channel1", (data) => {
      console.log(`user nous dit ${data}`);
    });
    socket.on("create or join", (roomId) => {
      console.log("meg", socket.room);
      if (!roomId) {
        console.log("no room id");
        roomId = socket.room;
      }
      socket.leave(socket.room);
      socket.join(roomId);

      const numClients = io.sockets.adapter.rooms[roomId].length;
      console.log(`${numClients} clients connected in room ${roomId}`);
      if (numClients === 1) {
        // eslint-disable-next-line no-param-reassign
        socket.username = "host";
        socket.emit("created", roomId);
      } else {
        // eslint-disable-next-line no-param-reassign
        socket.username = "client";
        socket.emit("joined", roomId);
      }
    });
    socket.on("create room", () => {
      console.log("creating a room");
      let roomId = s4();
      socket.leave(socket.room);
      socket.join(roomId);
      const numClients = io.sockets.adapter.rooms[roomId].length;

      socket.emit("room info", { roomId: roomId, numClients: numClients });
    });
    socket.on("join a room", (roomId) => {
      console.log("trying to join : ", roomId);
      if (io.sockets.adapter.rooms[roomId]) {
        socket.leave(socket.room);
        socket.join(roomId);
        const numClients = io.sockets.adapter.rooms[roomId].length;
        let info = {
          success: true,
          roomInfo: {
            roomId: roomId,
            numClients: numClients,
          },
        };
        console.log("info");
        console.log(info);
        socket.emit("joined", info);
        io.to(roomId).emit("room info", {
          roomId: roomId,
          numClients: numClients,
        });
      } else {
        console.log("No room found for this id");
      }
    });
    socket.on("update room info", (roomId) => {
      const numClients = io.sockets.adapter.rooms[roomId].length;
      io.to(roomId).emit("room info", {
        roomId: roomId,
        numClients: numClients,
      });
    });
    let readyCount = 0;
    socket.on("ready", () => {
      // console.log(io.sockets.adapter.rooms);
      readyCount++;
      console.log("user seems ready");
      if (readyCount === io.sockets.adapter.rooms[socket.room].length) {
        socket.emit("everyone is ready", true);
      }
    });

    // Called when a user closes the connection
    socket.on("disconnecting", (reason) => {
      console.log(
        `${socket.username} disconnected from ${
          Object.values(socket.rooms)[1]
        } using ${socket.client.conn.transport.constructor.name}`
      );
      // socket.to(Object.values(socket.rooms)[1]).emit('disconnect')
      io.in(Object.values(socket.rooms)[1]).emit("disconnect");
      console.log(reason);
      // socket.leave(socket.room)
    });
  });
};
