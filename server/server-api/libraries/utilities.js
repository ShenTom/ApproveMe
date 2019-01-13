const slack = require("slack");

const roomOpener = ({ userId }) => {
  return new Promise((resolve, reject) => {
    slack.im
      .open({
        token:
          process.env.ENV === "development"
            ? process.env.DEV_BTOKEN
            : process.env.PROD_BTOKEN,
        user: userId
      })
      .then(resolve)
      .catch(reject);
  });
};

const userQuery = ({ userId }) => {
  return new Promise((resolve, reject) => {
    slack.users
      .info({
        token:
          process.env.ENV === "development"
            ? process.env.DEV_BTOKEN
            : process.env.PROD_BTOKEN,
        user: userId
      })
      .then(resolve)
      .catch(reject);
  });
};

module.exports = { roomOpener, userQuery };
