var slack = require('slack');

//im.open + chat.postMessage (work in progress...)

const openRoom = async function (userID) {
  
    //need update... user string is now with userID
  
    var room = await slack.im.open({token: process.env.BTOKEN, user: userID})
    
    console.log("Open room: ", room);
  
    if (room.okay == false) {
        console.log("invalid username...");
        return
    }
  
    var roomID = room.channel.id;
  
    return roomID;
}


module.exports = openRoom;
