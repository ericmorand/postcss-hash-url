const functions = require('postcss-functions');
const postcss = require('postcss');
const createSha = require('sha.js');
const path = require('path');
const util = require('util');
const url = require('url');
const fs = require('fs-extra');

const unquote = require('unquote');
const quote = require('quote');

const Promise = require('promise');
const readFile = Promise.denodeify(fs.readFile, 2);
const outputFile = Promise.denodeify(fs.outputFile, 2);

function plugin(options) {
  var params = options || {};

  if (params.basePath === undefined) {
    params.basePath = '';
  }

  if (params.destPath === undefined) {
    params.destPath = '';
  }

  if (params.assetsPath === undefined) {
    params.assetsPath = '';
  }

  if (params.sha === undefined) {
    params.sha = 'sha256';
  }

  var formatUrl = function (urlString) {
    return util.format('url(%s)', quote(urlString));
  };

  var functionsOptions = {
    functions: {
      url: function (urlString) {
        return new Promise(function (fulfill, reject) {
          urlString = unquote(urlString);

          var parsedUrl = url.parse(urlString, false, true);

          if (!parsedUrl.host) {
            var filePath = path.resolve(path.join(params.basePath, parsedUrl.pathname));

            try {
              var sha = createSha(params.sha);
              var ext = path.extname(filePath);

              return readFile(filePath).then(
                function (data) {
                  var hash = sha.update(data).digest('hex');
                  var hashedUrlString = path.join(params.assetsPath, util.format('%s%s', hash, ext));
                  var outputPath = path.join(params.destPath, hashedUrlString);

                  return outputFile(outputPath, data).then(
                    function () {
                      fulfill(hashedUrlString);
                    }
                  );
                },
                function (err) {
                  var hash = sha.update(filePath).digest('hex');
                  var hashedUrlString = path.join(params.assetsPath, util.format('%s%s', hash, ext));

                  fulfill(hashedUrlString);
                }
              );
            }
            catch (err) {
              reject(err);
            }
          }
          else {
            fulfill(urlString);
          }
        }).then(
          function (result) {
            return formatUrl(result);
          }
        );
      }
    }
  };

  return postcss().use(functions(functionsOptions));
}

module.exports = postcss.plugin('postcss-hash-url', plugin);