var slack = require("slack");

const parseTags = function(string) {
  //need update... user string is now with userID

  var users = string.split(" ");

  var result = [];

  for (var i = 0; i < users.length; i++) {
    var end = users[i].indexOf("|");
    var id = users[i].slice(2, end);
    result.push(id);
  }

  console.log("Users: ", users);
  console.log("User IDs: ", result);

  return result;
};

module.exports = parseTags;
