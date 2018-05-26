var request = require('request');

const sendMessage = function(url, msg) {
    var postOptions = {
        uri: url,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: msg
    }
    
    request(postOptions, (error, resp, body) => {
        if (error) {
            console.log("Error sending message back to Slack!");
        }
    });
}

module.exports = sendMessage;