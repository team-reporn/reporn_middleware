const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId, endpoint } = require("../utils");
const fetch = require("node-fetch");

async function signup(parent, args) {
  const body = `{
        "email": "${args.email}",
        "login": "${args.login}",
        "password": "${args.password}"
    }`;
  const user = fetch(endpoint + "users", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      return res;
    });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  console.log("meh", args);
  const body = `{
    "email": "${args.email}",
    "password": "${args.password}"
}
`;
  // 1
  const user = await fetch(endpoint + "login", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((res) => res);
  if (!user) {
    throw new Error("No such user found");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 3
  return {
    token,
    user,
  };
}

module.exports = {
  signup,
  login,
};
