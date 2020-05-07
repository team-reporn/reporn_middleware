module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("connection of a user");
    socket.on("channel1", (data) => {
      console.log(`user nous dit ${data}`);
    });
    socket.on("create or join", (roomId) => {
      socket.leave(socket.room);
      socket.join(roomId);
      const numClients = io.sockets.adapter.rooms[roomId].length;
      console.log(`${numClients} clients connected in room ${roomId}`);
      if (numClients > 2) {
        // Trying to join a full room
        socket.leave(roomId);
        socket.emit("full room", roomId);
        return;
      }
      if (numClients === 1) {
        // eslint-disable-next-line no-param-reassign
        socket.username = "host";
        socket.emit("created", roomId);
        console.log("emitted create");
      } else {
        // eslint-disable-next-line no-param-reassign
        socket.username = "client";
        socket.emit("joined", roomId);
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
