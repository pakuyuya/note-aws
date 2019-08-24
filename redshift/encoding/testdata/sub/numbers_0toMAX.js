const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');

const LF = '\n';

module.exports = ((filename, records) => {
    // write 0,1,2,3,4 ... recordmax
    const tmpfilenm = `${filename}_tmp`
    
    const tmpfd = fs.openSync(tmpfilenm, 'w');
    for (let i=0; i<records; i++) {
        if ((i % 1000000) === 0) { console.log(`${filename} ... ${i} records`) }
        const row = `${i}`
        fs.writeSync(tmpfd, `${row}${LF}`)
    }
    fs.closeSync(tmpfd)
    
    fs.createReadStream(tmpfilenm)
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream(filename))
})