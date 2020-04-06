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

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})

