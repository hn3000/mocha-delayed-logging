
const { assert } = require('chai');

const { logContains, logContents } = require('..'); // install our delayed logging code

describe('unit testing', function() {
  describe('with logging', function() {
    it('won\'t log visibly if successful', function() {
      console.log('this SHOULD NOT be visible in test output');
    });
    it('can verify logging in tests', async function() {
      console.log('dummy log output 1');
      console.warn('dummy log output 2');
      console.warn('Just some log output, we\'ll check it was logged');

      assert.isTrue(await logContains(/dummy log output \d/), ['a',...(await logContents())].join('#'));
      assert.isTrue(await logContains('Just some log output, we\'ll check it was logged'), ['b',...(await logContents())].join('#'));
    });
    it('gives access to full logging contents', async function() {
      const logMessage = "actual log contents will also include a newline after this";
      console.log(logMessage);
      const log = await logContents();
      assert.strictEqual(log[0], logMessage+"\n");
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
