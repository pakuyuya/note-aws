const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');

const LF = '\n';

let values = [
    0, 1000, 2500, 2400, 1530, 25000, 80000, 75000, 100000, 900000,
    20000, 5309, 53254, 32499, 1034, 44488, 9601, 10, 342, 23001,
    53025, 44445, 3245, 99545, 325, 15, 54535, 7235, 2355, 435,
]

function shuffle_easy(ary) {
    return ary.sort(() => Math.random() - .5);
}

module.exports = (filename, records) => {
    // write 0,1,2,3,4 ... recordmax
    const tmpfilenm = `${filename}_tmp`
    
    const tmpfd = fs.openSync(tmpfilenm, 'w');
    for (let i=0; i<records;) {
        values = shuffle_easy(values)

        for (let j=0; j<values.length && j<records; j++, i++) {
            if ((i % 1000000) === 0) { console.log(`${filename} ... ${i} records`) }
            const row = `${values[j]}`
            fs.writeSync(tmpfd, `${row}${LF}`)
        }
    }
    fs.closeSync(tmpfd)
    
    fs.createReadStream(tmpfilenm)
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream(filename))
}