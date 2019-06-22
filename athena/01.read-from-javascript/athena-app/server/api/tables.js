const AWS = require('aws-sdk')
const uuidv1 = require('uuid/v1')

const s3 = new AWS.S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESSKEY,
  secretAccessKey: process.env.S3_SECRETKEY
})
const athena = new AWS.Athena({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESSKEY,
  secretAccessKey: process.env.S3_SECRETKEY
})

module.exports = {
  func: async function (req, res) {
      const query = 'SHOW TABLES;'
      const s3key = `${process.env.S3_ATHENA_WORK}/${uuidv1()}`
      const s3output = `s3://${process.env.S3_BUCKET}/${s3key}`
      const queryid = await startQuery(query, s3output)
  
      await waitQueryEnd(queryid)
      const result = await getResult(queryid)
      res.json(result)
  
      s3.deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: s3key
      })
  }
}

// こちらの記事より拝借しました https://qiita.com/naoto_koyama/items/6bfc6e67260e761fd1b4
function startQuery(query, s3output) {
  return new Promise(function (resolve, reject) {
    const params = {
      QueryString: query, /* required */
      ResultConfiguration: { /* required */
        OutputLocation: s3output // ここにAthenaのアウトプットのパスを指定する
      }
    }
    athena.startQueryExecution(params, function (err, data) {
      if (err) {
        reject(err)
        return
      }
      console.log('data : ', data)
      resolve(data.QueryExecutionId)
    })
  })
}

function waitQueryEnd(queryExecutionId) {
  return new Promise(function (resolve, reject) {
    let time = 0
    const params = { QueryExecutionId: queryExecutionId /* required */}
    function loop() {
      if (time < 20) {
        athena.getQueryExecution(params, function (err, data) {
          console.log('Status : ', data.QueryExecution.Status.State)
          if (data.QueryExecution.Status.State == 'SUCCEEDED') {
            resolve(queryExecutionId)
          } else if (data.QueryExecution.Status.State == 'FAIED') {
            reject(data.QueryExecution.Status.OutputLocation)
          } else {
            time += 2
            setTimeout(loop, 2000)
          }
        })
      } else {
        reject('timeout error!!!')
        return false
      }
    }
    setTimeout(loop, 2000)
  })
}

function getResult(queryExecutionId) {
  return new Promise(function (resolve, reject) {
    const params = {
      QueryExecutionId: queryExecutionId /* required */
    }
    athena.getQueryResults(params, function (err, result) {
      resolve(result.ResultSet.Rows)
    })
  })
}
