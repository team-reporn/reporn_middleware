const fetch = require("node-fetch");
const { APP_SECRET, getUserId, endpoint } = require("../utils");

const users = (parent, args, context, info) => {
  const userId = getUserId(context);
  console.log("userId",userId);
  return fetch(endpoint + "users")
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      return res;
    });
};

module.exports = {
  users,
};
