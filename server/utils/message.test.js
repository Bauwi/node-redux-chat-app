const expect = require('expect');
const moment = require('moment');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const res = generateMessage('User1', 'This is a test message.');
    expect(res.from).toBe('User1');
    expect(res.text).toBe('This is a test message.');
    expect(typeof res.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate location google map url', () => {
    const res = generateLocationMessage('User1', 45.0001, -75.0001);
    expect(res.from).toBe('User1');
    expect(res.coords).toEqual([45.0001, -75.0001]);
    expect(typeof res.createdAt).toBe('number');
  });
});
