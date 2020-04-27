const fetch = require("node-fetch");

console.log("meh");
const url = "http://127.0.0.1:3000/api/users";

fetch(url)
  .then(response => response.json())
  .then(res => {
    console.log(res);
    return res;
  });
