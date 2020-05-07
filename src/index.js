const path = require( "path");
const http = require( "http");
const express = require( "express");
// const jwt = require( "jsonwebtoken");
const SocketIO = require( "socket.io");
const server = require( "./server.js");
const socket = require( "./socket");

// eslint-disable-next-line prettier/prettier
// const __dirname = path.join(
//   path.dirname(decodeURI(new URL(import.meta.url).pathname))
// );

const app = express();
const httpServer = http.createServer(app);

const io = new SocketIO(httpServer);
socket(io);

console.log(`env is ${process.env.IS_UNDER_CONSTRUCTION}`);
if (process.env.IS_UNDER_CONSTRUCTION === "true") {
  app.set("view engine", "ejs");
  app.set("views", `${__dirname}/views`);
  app.get("*", async (req, res) => {
    res.render("construction", {
      welcomeMessage: process.env.REACT_APP_WELCOME_MESSAGE,
    });
  });
} else if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/build")));
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
  });
}

app.use((req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    return next();
  }
  //check the auth of the user
  //   const { token } = req.cookies;
  //   if (token) {
  //     const { userId } = jwt.verify(token, process.env.JWT_SECRET);
  //     // Put the userId onto the req for future requests to access
  //     req.userId = userId;
  //   }
  next();
});

server.applyMiddleware({
  app,
  path: "/graphql",
  cors: {
    credentials: true,
    origin: `${process.env.DOMAIN_FULL}:${process.env.PORT}` || "3000",
  },
});

httpServer.listen(
  {
    port: process.env.PORT || 4000,
    host: "0.0.0.0",
  },
  () => console.log(`Server is running on ${server.graphqlPath}`)
);
