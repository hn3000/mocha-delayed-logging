
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
      decodeStrings: false,
      write(chunk, encoding, callback) {
        delayTasks.push((s, cb) => (s??orig).write(chunk, encoding, cb));
        callback && queueMicrotask(callback);
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

async function logContains(what) {
  //let re = (text instanceof RegExp) ? text : new RegExp(text);

  const check = (what instanceof RegExp) 
              ? (x) => (null != what.exec(x))
              : (x) => x.includes(what);

  const delayTasks = console._delayTasks;
  if (delayTasks) {
    let found = false;
    const checkWriter = new Writable({
      decodeStrings: false,
      write(chunk, encoding, callback) {
        const checkResult = check(chunk);
        found = found || checkResult;
        callback && queueMicrotask(callback);
      }
    });

    const all = delayTasks.map((x) => donePromise(cb => x(checkWriter, cb)));
    await Promise.all(all);
    return found;
  }
  return false;
}


async function logContents() {
  const delayTasks = console._delayTasks;
  if (delayTasks) {
    const contents = [];
    const tmpWriter = new Writable({
      decodeStrings: false,
      write(chunk, encoding, callback) {
        contents.push(chunk);
        callback && queueMicrotask(callback);
      }
    });

    const all = delayTasks.map((x) => donePromise(cb => x(tmpWriter, cb)));
    await Promise.all(all);

    return contents;
  }
  return undefined;
}


function donePromise(fun) {
  const result = new Promise((res,_) => {
    fun(res);
  });
  return result;
}

module.exports.logContains = logContains;
module.exports.logContents = logContents;