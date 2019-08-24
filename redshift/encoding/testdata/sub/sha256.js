const fs = require('fs');
const zlib = require('zlib');
const crypto = require("crypto");

const LF = '\n';


module.exports = (filename, records) => {
    const tmpfilenm = `${filename}_tmp`
    
    const tmpfd = fs.openSync(tmpfilenm, 'w');
    for (let i=0; i<records; i++) {
        if ((i % 1000000) === 0) { console.log(`${filename} ... ${i} records`) }
        const sha512 = crypto.createHash('sha512')
        sha512.update(`${i}`)
        const row = `${sha512.digest('hex')}`
        fs.writeSync(tmpfd, `${row}${LF}`)
    }
    fs.closeSync(tmpfd)
    
    fs.createReadStream(tmpfilenm)
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream(filename))
}