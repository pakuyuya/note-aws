const fs = require('fs');
const zlib = require('zlib');

const LF = '\n';


const prefs = ['愛知県','青森県','秋田県','石川県','茨城県','岩手県','愛媛県','大分県','大阪府','岡山県','沖縄県','香川県','鹿児島県','神奈川県','岐阜県','京都府','熊本県','群馬県','高知県','埼玉県','佐賀県','滋賀県','静岡県','島根県','千葉県','東京都','徳島県','栃木県','鳥取県','富山県','長崎県','長野県','奈良県','新潟県','兵庫県','広島県','福井県','福岡県','福島県','北海道','三重県','宮城県','宮崎県','山形県','山口県','山梨県','和歌山県']


module.exports = (filename, records, burst) => {
    // write 0,1,2,3,4 ... recordmax
    const tmpfilenm = `${filename}_tmp`
    
    const tmpfd = fs.openSync(tmpfilenm, 'w');
    for (let i=0; i<records; i++) {
        if ((i % 1000000) === 0) { console.log(`${filename} ... ${i} records`) }
        const row = `${prefs[~~(i/burst) % prefs.length]}`
        fs.writeSync(tmpfd, `${row}${LF}`)
    }
    fs.closeSync(tmpfd)
    
    fs.createReadStream(tmpfilenm)
      .pipe(zlib.createGzip())
      .pipe(fs.createWriteStream(filename))
}