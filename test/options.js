const postcss = require('postcss');
const plugin = require('..');
const test = require('tap').test;
const path = require('path');
const fs = require('fs');

function process(css, options, postcssOptions) {
  return postcss().use(plugin(options)).process(css, postcssOptions);
}

var options = {
  basePath: path.resolve('./test/local/valid'),
  destPath: path.resolve('./tmp'),
  assetsPath: 'assets',
  sha: 'sha256'
};

test('invalid sha', function (t) {
  t.plan(1);

  options.sha = 'dummy';

  var css = fs.readFileSync(path.resolve('./test/local/valid/index.css'));

  return process(css, options).then(
    function() {
      t.fail('Invalid SHA should throw an exception');
    },
    function(err) {
      t.pass(err);
    }
  );
});