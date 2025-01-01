const request = require('request');
const fs = require('fs');
var AdmZip = require('adm-zip');

var fileUrl = 'https://github.com/bitcoindevkit/bdk-swift/releases/download/1.0.0-alpha.11/bdkFFI.xcframework.zip';

const src = 'ios/bdkFFI.xcframework.zip';
const target = 'ios/';

try {
  request(fileUrl)
    .pipe(fs.createWriteStream(src))
    .on('close', function () {
      var zip = new AdmZip(src);
      zip.extractAllTo(target, true);
      fs.unlinkSync(src);
    });
} catch (err) {
  console.log(err);
}
