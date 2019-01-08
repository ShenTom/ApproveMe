const slack = require("slack");

const roomOpener = ({ userId }) => {
  return new Promise((resolve, reject) => {
    slack.im
      .open({ token: process.env.BTOKEN, user: userId })
      .then(resolve)
      .catch(reject);
  });
};

const userQuery = ({ userId }) => {
  return new Promise((resolve, reject) => {
    slack.users
      .info({ token: process.env.BTOKEN, user: userId })
      .then(resolve)
      .catch(reject);
  });
};

module.exports = { roomOpener, userQuery };
