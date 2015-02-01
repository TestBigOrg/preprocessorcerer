var fs = require('fs'),
    sniffer = require('mapbox-file-sniff'),
    preprocessors = require('./preprocessors'),
    parts = require('./parts');

module.exports = preprocess;

function preprocess(infile, callback) {
  var info;

  fs.stat(infile, getType);

  function getType(err, stats) {
    if (err) return callback(err);
    info = stats;
    sniffer.quaff(infile, function(err, type) {
      info.filetype = type;
      preprocessors(infile, info, getParts);
    });
  }

  function getParts(err, outfile) {
    parts(outfile, info, function(err, parts) {
      if (err) return callback(err);
      callback(null, outfile, parts);
    });
  }
}