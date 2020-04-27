const fetch = require("node-fetch");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList
} = require("graphql");
// const x = fetch("localhost:3000/api/users").then(res => {
//   res.json();
// });

const UserType = new GraphQLObjectType({
  name: "User",
  description: "...",

  fields: () => ({
    email: {
      type: GraphQLString,
      resolve: json => {
        return json.username;
      }
    },
    id: {
      type: GraphQLInt,
      resolve: json => {
        return json.id;
      }
    }
  })
});

const url = "http://api.reporn.remiruc.com/api/users";

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    description: "...",
    fields: () => ({
      users: {
        type: GraphQLList(UserType),
        resolve: root =>
          fetch(url)
            .then(response => response.json())
            .then(res => {
              console.log(res);
              return res;
            })
      }
    })
  })
});
