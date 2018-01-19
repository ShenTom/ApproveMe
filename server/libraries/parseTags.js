var slack = require('slack');

const parseTags = async function (string) {
  
    
    var users = [];
    while (string.indexOf("@") != string.lastIndexOf("@")) {
        var start = string.indexOf("@") + 1;
        var end = string.indexOf("@", start) -1;
        users.push(string.slice(start, end));
        string = string.slice(end+1)
    }
    users.push(string.slice(1));
    
    console.log("Users: ", users);
  
    var result = [];
  
    var data = await slack.users.list({token: process.env.OTOKEN, limit: 250})
      
    for (var i=0; i<data.members.length; i++) {
        if (users.indexOf(data.members[i].name) != -1) {
            result.push(data.members[i].id);
            users.splice(users.indexOf(data.members[i].name), 1);
        }
        if (users.length == 0) {
            break;    
        }
    }
    console.log("User IDs: ", result);

    return result;
}


module.exports = parseTags;