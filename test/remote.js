const postcss = require('postcss');
const plugin = require('..');
const test = require('tap').test;
const path = require('path');
const fs = require('fs');

function process(css, options, postcssOptions) {
  return postcss().use(plugin(options)).process(css, postcssOptions);
}

// remote URLs should remain untouched
test('remote', function (t) {
  t.plan(1);

  var css = fs.readFileSync(path.resolve('./test/remote/index.css'), 'utf8');

  return process(css, {}).then(
    function(result) {
      var awaited = fs.readFileSync(path.resolve('./test/remote/awaited.css')).toString();

      t.equal(result.css, awaited);
    },
    function(err) {
      t.fail(err);
    }
  );
});