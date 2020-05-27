const Game = require("./Game.js");
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
    // socket.on("create or join", (roomId) => {
    //   console.log("meg", socket.room);
    //   if (!roomId) {
    //     console.log("no room id");
    //     roomId = socket.room;
    //   }
    //   socket.leave(socket.room);
    //   socket.join(roomId);

    //   const numClients = io.sockets.adapter.rooms[roomId].length;
    //   console.log(`${numClients} clients connected in room ${roomId}`);
    //   if (numClients === 1) {
    //     // eslint-disable-next-line no-param-reassign
    //     socket.username = "host";
    //     socket.emit("created", roomId);
    //   } else {
    //     // eslint-disable-next-line no-param-reassign
    //     socket.username = "client";
    //     socket.emit("joined", roomId);
    //   }
    // });
    socket.on("create room", () => {
      console.log("creating a room");
      Object.values(socket.rooms).forEach((roomId, index) => {
        if (index > 0) {
          socket.leave(roomId);
        }
      });
      let roomId = s4();
      socket.join(roomId);
      const numClients = io.sockets.adapter.rooms[roomId].length;
      socket.role = "owner";
      socket.emit("room info", {
        roomId: roomId,
        numClients: numClients,
        role: socket.role,
      });
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
        socket.role = "user";
        socket.emit("joined", info);
        socket.emit("room info", {
          roomId: roomId,
          numClients: numClients,
          role: socket.role,
        });
      } else {
        console.log("No room found for this id");
      }
    });
    socket.on("update game info", (roomId)=>{
      let roomId = Object.values(socket.rooms)[1];
      if(io.of("/").in(roomId).game){
        socket.emit("game info", io.of("/").in(roomId).game)
      }
    })
    socket.on("update room info", (roomId) => {
      if (io.sockets.adapter.rooms[roomId]) {
        const numClients = io.sockets.adapter.rooms[roomId].length;
        //CHECK IF THERE IS AN OWNER
        io.of("/")
          .in(roomId)
          .clients((error, clients) => {
            if (error) throw error;
            let isOwned = false;
            clients.forEach((client) => {
              // console.log(io.of("/").connected[client].role);
              if (io.of("/").connected[client].role === "owner") {
                isOwned = true;
              }
            });
            if (!isOwned) {
              socket.role = "owner";
            }
          });
        // io.to(roomId).emit
        socket.emit("room info", {
          roomId: roomId,
          numClients: numClients,
          role: socket.role,
        });
      } else {
        console.log("trying to update on a non existing room");
        socket.emit("room info", {
          roomId: "inexistant",
        });
      }
    });
    let readyCount = 0;
    socket.on("start playing", () => {
      let roomId = Object.values(socket.rooms)[1];
      if (socket.role === "owner") {
        console.log("start : ", roomId);
        let socketList = [];
        //CREATE A NEW GAME WITH THE LIST OF THE PLAYERS
        io.of("/")
          .in(roomId)
          .clients((error, clients) => {
            if (error) throw error;
            clients.forEach((client) => {
              let soc = io.of("/").connected[client];

              socketList.push(soc);
            });
            io.of("/").in(roomId).game = new Game({ sockets: socketList });
            io.of("/").in(roomId).game.initialize();
            io.to(socket.room).emit(
              "game start",
              io.of("/").in(roomId).game.getPlayerById({ id: socket.id })
            );
          });
      }
    });
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
    socket.on("disconnect", (reason) => {
      console.log("disconnect", reason);
    });
  });
};
