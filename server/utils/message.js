const moment = require("moment");

const generateMessage = (from, text) => ({
  type: "message",
  from,
  text,
  createdAt: moment().valueOf()
});

const generateLocationMessage = (from, latitude, longitude) => {
  return {
    type: "locationMessage",
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
};

module.exports = { generateMessage, generateLocationMessage };
