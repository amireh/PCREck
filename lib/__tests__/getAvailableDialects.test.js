var subject = require('../getAvailableDialects');

describe('#getAvailableDialects', function() {
  it('should work', function() {
    expect(subject()).to.include('PCRE');
  });
});