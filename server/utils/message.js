let moment = require('moment');

if ('default' in moment) {
  moment = moment.default;
}

const generateMessage = (from, text) => ({
  type: 'message',
  from,
  text,
  createdAt: moment().valueOf()
});

const generateLocationMessage = (from, latitude, longitude) => ({
  type: 'locationMessage',
  from,
  coords: [latitude, longitude],
  createdAt: moment().valueOf()
});

module.exports = { generateMessage, generateLocationMessage };
