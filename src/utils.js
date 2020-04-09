const jwt = require("jsonwebtoken");
const APP_SECRET = "GraphQL-is-aw3some";

const endpoint = "http://127.0.0.1:8080/api/";

function getUserId(context) {
  console.log("context: ", context.request.get("Authorization"));
  const Authorization = context.request.get("Authorization");
  if (Authorization) {
    const token = Authorization.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  }

  throw new Error("Not authenticated");
}

module.exports = {
  APP_SECRET,
  getUserId,
  endpoint,
};
