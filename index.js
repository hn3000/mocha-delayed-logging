
const { Writable } = require('stream');
const { Console } = require('console');

let origConsole = console;

beforeEach(function () {
  //console.debug('beforeEach (hook)');

  const delayTasks = [];
  origConsole = console;
  console = new Console({
    stdout: delayedStream(process.stdout),
    stderr: delayedStream(process.stderr),
  });
  console._delayTasks = delayTasks;
  function delayedStream(orig) {
    const result = new Writable({
      write(chunk, encoding, callback) {
        delayTasks.push(() => orig.write(chunk, encoding, () => {}));
        queueMicrotask(callback);
      }
    });

    return result;
  }
});

afterEach(function () {
  if (this.currentTest.state !== 'passed') {
    if (console._delayTasks) {
      const delayTasks = console._delayTasks;
      delayTasks.forEach(x => x());
    }
  }
  console = origConsole;
  //console.debug('afterEach (hook)');
});
