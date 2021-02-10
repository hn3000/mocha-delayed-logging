
const { assert } = require('chai');

require('..'); // install our delayed logging code

describe('unit testing', function() {
  describe('with logging', function() {
    it('won\'t log visibly if successful', function() {
      console.log('this should not be visible in test output');
    });
    it('will show all logging output for failed tests (and so this test must fail)', function() {
      console.log('dummy log');
      console.info('dummy info');
      console.warn('dummy warning');
      console.error('dummy error');
      console.debug('there should be 4 lines, each starting with `dummy`, above');
      assert(false, 'not an actual failure, just a way to force the logging to be visible')
    });
  });
});
