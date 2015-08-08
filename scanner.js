var walk = require ("walk");
var path = require ("path");
exports.scan = function (directory, callback) {
  var files = [];
  var addFile = function (root, fileStat, next) {
    files.push (path.resolve(root, fileStat.name));
    console.log ("ADDED FILE " + fileStat.name);
    next();
  };
  var done = function () {
    console.log ("DONE SCANNING");
    callback (files);
  };
  console.log (directory);
  var walker = walk.walk (directory, {followLinks: false});
  walker.on("file", addFile);
  walker.on("end", done);
};
