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
    coords: [latitude, longitude],
    createdAt: moment().valueOf()
  };
};

module.exports = { generateMessage, generateLocationMessage };
