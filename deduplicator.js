var fs = require("fs");
var crypto = require ("crypto");
var algorithm = "md5";
var hashes = [];
exports.deduplicate = function (files, callback) {
  hashes = [];
  for (var i = 0; i < files.length; i++) {
    var data = fs.readFileSync (files[i], {encoding: "utf8"});
    var hash = crypto.createHash(algorithm).update(data).digest('hex');
    if (hashes.indexOf(hash) !== -1) {
      console.log ("Found Duplicate " + files[i]);
      // This is a duplicate.
      fs.unlink(files[i], function (err) {
        if (err) {
          throw err;
        }
      });
    } else {
      hashes.push(hash);
    }
  }
  callback();
};
