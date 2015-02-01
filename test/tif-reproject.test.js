var test = require('tape'),
    reproject = require('../preprocessors/tif-reproject.preprocessor'),
    os = require('os'),
    path = require('path'),
    crypto = require('crypto'),
    googleMerc = path.resolve(__dirname, 'fixtures', 'google-merc.tif'),
    sphericalMerc = path.resolve(__dirname, 'fixtures', 'spherical-merc.tif'),
    wgs84 = path.resolve(__dirname, 'fixtures', 'wgs84.tif'),
    geojson = path.resolve(__dirname, 'fixtures', 'valid.geojson'),
    gdal = require('gdal');

test('criteria: not a tif', function(assert) {
  reproject.criteria(geojson, { filetype: 'geojson' }, function(err, process) {
    assert.ifError(err, 'no error');
    assert.notOk(process, 'do not process');
    assert.end();
  });
});

// https://github.com/mapbox/mapnik-omnivore/issues/79
// test('criteria: in epsg:3857', function(assert) {
//   reproject.criteria(sphericalMerc, { filetype: 'tif' }, function(err, process) {
//     assert.ifError(err, 'no error');
//     assert.notOk(process, 'do not process');
//     assert.end();
//   });
// });

test('criteria: in epsg:900913', function(assert) {
  reproject.criteria(sphericalMerc, { filetype: 'tif' }, function(err, process) {
    assert.ifError(err, 'no error');
    assert.ok(process, 'do process');
    assert.end();
  });
});

test('criteria: in epsg:4326', function(assert) {
  reproject.criteria(sphericalMerc, { filetype: 'tif' }, function(err, process) {
    assert.ifError(err, 'no error');
    assert.ok(process, 'do process');
    assert.end();
  });
});

test('reprojection: to epsg:3857', function(assert) {
  var outfile = path.join(os.tmpdir(), crypto.randomBytes(8).toString('hex'));
  reproject(wgs84, outfile, function(err) {
    assert.ifError(err, 'no error');
    var ds = gdal.open(outfile);
    assert.ok(ds.srs.isSame(gdal.SpatialReference.fromEPSG(3857)), 'reprojected correctly');
    assert.end();
  });
});