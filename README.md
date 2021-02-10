
# delayed console logging for mocha

If you're unit testing code that also prints some debug info or warnings
with `console.log`, `console.warn` or uses some other `console` output 
in node, then just add `require('@hn3000/mocha-delayed-logging')` and only
see console output for failed tests.


## Example output

Run `npm test` or `yarn test` in this project to see this example. (Sorry, 
couldn't automate the check for debug output in a failing test.)

```
$ npm test

> @hn3000/mocha-delayed-logging@1.0.0 test /Users/hn3000/play/mocha-delayed-logging
> mocha



  unit testing
    with logging
      ✓ won't log visibly if successful
      1) will show all logging output for failed tests (and so this test must fail)
dummy log
dummy warning
dummy info
dummy error
there should be 4 lines, each starting with `dummy`, above


  1 passing (7ms)
  1 failing

  1) unit testing
       with logging
         will show all logging output for failed tests (and so this test must fail):
     AssertionError: not an actual failure, just a way to force the logging to be visible
      at Context.<anonymous> (test/test.js:16:7)
      at processImmediate (internal/timers.js:461:21)



npm ERR! Test failed.  See above for more details.
```
