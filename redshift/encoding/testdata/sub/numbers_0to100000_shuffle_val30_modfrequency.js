const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');

const LF = '\n';

let valuesbase_x1 = [
    53025, 44445, 3245, 99545, 325, 15, 54535, 7235, 2355, 435, 2500, 2400, 1530, 25000,
]
let valuesbase_x2 = [
    20000, 5309, 53254, 32499, 1034, 44488, 9601, 10, 342, 23001, 80000, 75000,
]
let valuesbase_x5 = [
    0, 1000, 100000, 90000,
]
let values = []
for (let i=0; i<5; i++) {
    for (let j=0; j<10; j++) {
        if (i < 1) {
            values = values.concat(valuesbase_x1)
        }
        if (i < 2) {
            values = values.concat(valuesbase_x2)
        }
        if (i < 5) {
            values = values.concat(valuesbase_x5)
        }
    }
}

function shuffle_easy(ary) {
    return ary.sort(() => Math.random() - .5);
}

module.exports = (filename, records) => {
    // write 0,1,2,3,4 ... recordmax
    const tmpfilenm = `${filename}_tmp`
    
    const tmpfd = fs.openSync(tmpfilenm, 'w');
    for (let i=0; i<records; i++) {
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