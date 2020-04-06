const express = require("express");
const graphqlHTTP = require("express-graphql");
const app = express();

const schema = require("./schema.js");

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const port = 8000;

app.listen(port, "localhost");

console.log("listening on port :", port);
