const postcss = require('postcss');
const plugin = require('..');
const test = require('tap').test;
const path = require('path');
const fs = require('fs');

function process(css, options, postcssOptions) {
  return postcss().use(plugin(options)).process(css, postcssOptions);
}

test('valid local URL', function (t) {
  t.plan(2);

  var css = fs.readFileSync(path.resolve('./test/local/valid/index.css'));
  var options = {
    basePath: path.resolve('./test/local/valid'),
    destPath: path.resolve('./tmp'),
    assetsPath: 'assets'
  };

  return process(css, options).then(
    function(result) {
      var awaited = fs.readFileSync(path.resolve('./test/local/valid/awaited.css')).toString();

      t.equal(result.css, awaited);

      // check assets existence
      try {
        fs.statSync(path.resolve(path.join(options.destPath, 'assets/5c15ac9d8ae999117df0e85552214e100114c24157fc882e5ea943cba1e3d91e.png')));

        t.pass();
      }
      catch (err) {
        t.fail(err);
      }
    },
    function(err) {
      t.fail(err);
    }
  );
});

test('invalid local URL', function (t) {
  t.plan(2);

  var css = fs.readFileSync(path.resolve('./test/local/invalid/index.css'));
  var options = {
    basePath: path.resolve('./test/local/invalid'),
    destPath: path.resolve('./tmp'),
    assetsPath: 'assets'
  };

  return process(css, options).then(
    function(result) {
      var awaited = fs.readFileSync(path.resolve('./test/local/invalid/awaited.css')).toString();

      t.equal(result.css, awaited);

      // check assets existence
      try {
        fs.statSync(path.resolve(path.join(options.destPath, 'assets/5c15ac9d8ae999117df0e85552214e100114c24157fc882e5ea943cba1e3d91e.png')));

        t.pass();
      }
      catch (err) {
        t.fail(err);
      }
    },
    function(err) {
      t.fail(err);
    }
  );
});