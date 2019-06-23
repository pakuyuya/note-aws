import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

## @params: [JOB_NAME]
## @params: [target_bucket]
args = getResolvedOptions(sys.argv,
                          ['JOB_NAME',
                           'target_bucket'])
print ("JOB_NAME     : ", args['JOB_NAME'])
print ("target_bucket: ", args['target_bucket'])



# こちらを参考にさせていただきました
# https://future-architect.github.io/articles/20180828/
# https://dev.classmethod.jp/cloud/aws/20180528-aws-glue-etl-job-with-spark-sql/


sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)
 

bucket = args['target_bucket']


df = glueContext.create_dynamic_frame.from_options(
    connection_type="s3",
    connection_options={
        "paths": ["s3://{0}/glue/csv2parquet/csv/test/".format(bucket)]},
    format="csv", 
    format_options={"withHeader": True}  # 1行目をスキーマ名として認識True
    )


## @type: DataSink
## @args: [connection_type = "s3", connection_options = "paths": ["s3://{0}/csv2parquet/parquet/test/".format(bucket)], format = "parquet"]
## @return: datasink
## @inputs: [frame = df]
datasink = glueContext.write_dynamic_frame.from_options(
        frame=df,  # 出力するDynamicFrameを指定
        connection_type="s3",
        connection_options={
            "paths": ["s3://{0}/glue/csv2parquet/parquet/test".format(bucket)],
            "compression": "snappy"
        },
        format="parquet",
        transformation_ctx = "datasink"
    )

job.commit()

# 何故か動かない
# 下記エラーログ
#File "script_2019-06-23-11-40-00.py", line 53, in <module>
#transformation_ctx = "datasink"
#File "/mnt/yarn/usercache/root/appcache/application_1561289672599_0002/container_1561289672599_0002_01_000001/PyGlue.zip/awsglue/dynamicframe.py", line 585, in from_options
#File "/mnt/yarn/usercache/root/appcache/application_1561289672599_0002/container_1561289672599_0002_01_000001/PyGlue.zip/awsglue/context.py", line 194, in write_dynamic_frame_from_options
#File "/mnt/yarn/usercache/root/appcache/application_1561289672599_0002/container_1561289672599_0002_01_000001/PyGlue.zip/awsglue/context.py", line 217, in write_from_options
#File "/mnt/yarn/usercache/root/appcache/application_1561289672599_0002/container_1561289672599_0002_01_000001/PyGlue.zip/awsglue/data_sink.py", line 32, in write
#File "/mnt/yarn/usercache/root/appcache/application_1561289672599_0002/container_1561289672599_0002_01_000001/PyGlue.zip/awsglue/data_sink.py", line 28, in writeFrame
#File "/mnt/yarn/usercache/root/appcache/application_1561289672599_0002/container_1561289672599_0002_01_000001/py4j-0.10.4-src.zip/py4j/java_gateway.py", line 1133, in __call__
#File "/mnt/yarn/usercache/root/appcache/application_1561289672599_0002/container_1561289672599_0002_01_000001/pyspark.zip/pyspark/sql/utils.py", line 79, in deco
#pyspark.sql.utils.IllegalArgumentException: u'Expected exactly one path to be specified, but got: '
#End of LogType:stdout
