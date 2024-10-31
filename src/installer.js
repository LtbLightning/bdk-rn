const axios = require('axios');
const fs = require('fs');
var AdmZip = require('adm-zip');

var fileUrl = 'https://github.com/bitcoindevkit/bdk-swift/releases/download/0.30.0/bdkFFI.xcframework.zip';

const src = 'ios/bdkFFI.xcframework.zip';
const target = 'ios/';

async function downloadAndExtract() {
  try {
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream',
    });

    const dest = fs.createWriteStream(src);
    response.data.pipe(dest);

    dest.on('finish', () => {
      var zip = new AdmZip(src);
      zip.extractAllTo(target, true);
      fs.unlinkSync(src);
    });
  } catch (err) {
    console.log(err);
  }
}

downloadAndExtract();