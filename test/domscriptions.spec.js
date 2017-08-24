const script = 'domscriptions.js';
const onLoad = require(`../src/${script}`).onLoadSubscriptions;
const chrome = require('sinon-chrome');
const expect = require('chai').expect;

describe(script, () => {
  it('should have better tests', () => {
    expect(true).to.be.true;
  });
});
