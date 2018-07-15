var request = require("request");

const parseDate = function(string) {
  var result = true;
  var arr = string.trim().split("-");

  console.log("date", arr);

  if (arr.length != 3) {
    result = false;
  } else if (arr[0].length != 2 || arr[1].length != 2 || arr[2].length != 4) {
    result = false;
  } else if (
    isNaN(parseInt(arr[0])) == true ||
    isNaN(parseInt(arr[1])) == true ||
    isNaN(parseInt(arr[2])) == true
  ) {
    result = false;
  }
  return result;
};

module.exports = parseDate;
