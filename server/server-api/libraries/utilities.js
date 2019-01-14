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

const timeConversion = ({ dateObj }) =>
  dateObj.toLocaleString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZoneName: "short",
    hour: "numeric",
    minute: "numeric",
    time: "numeric",
    timeZone: "America/Vancouver",
    hour12: false
  });

module.exports = { roomOpener, userQuery, timeConversion };
