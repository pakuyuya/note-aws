# こちらを参考にさせていただきました https://qiita.com/pioho07/items/9c897b03e452d49b80ef

import sys
from awsglue.transforms import *
from awsglue.utils import getResolvedOptions
from pyspark.context import SparkContext
from awsglue.context import GlueContext
from awsglue.job import Job

## @params: [JOB_NAME]
args = getResolvedOptions(sys.argv, ['JOB_NAME', 'bucket_name'])

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init(args['JOB_NAME'], args)

## @type: DataSource
## @args: [database = "default", table_name = "test", transformation_ctx = "datasource0"]
## @return: datasource0
## @inputs: []
datasource0 = glueContext.create_dynamic_frame.from_catalog(database = "default", table_name = "test", transformation_ctx = "datasource0")
## @type: ApplyMapping
## @args: [mapping = [("num", "int", "num", "int"), ("some", "string", "some", "string"), ("one", "string", "one", "string")], transformation_ctx = "applymapping1"]
## @return: applymapping1
## @inputs: [frame = datasource0]
applymapping1 = ApplyMapping.apply(frame = datasource0, mappings = [("num", "int", "num", "int"), ("some", "string", "some", "string"), ("one", "string", "one", "string")], transformation_ctx = "applymapping1")
## @type: ResolveChoice
## @args: [choice = "make_struct", transformation_ctx = "resolvechoice2"]
## @return: resolvechoice2
## @inputs: [frame = applymapping1]
resolvechoice2 = ResolveChoice.apply(frame = applymapping1, choice = "make_struct", transformation_ctx = "resolvechoice2")
## @type: DropNullFields
## @args: [transformation_ctx = "dropnullfields3"]
## @return: dropnullfields3
## @inputs: [frame = resolvechoice2]
dropnullfields3 = DropNullFields.apply(frame = resolvechoice2, transformation_ctx = "dropnullfields3")

bucket_name = args['bucket_name']
df = dropnullfields3.toDF()

partitionby=["num"]
df.repartition(*partitionby).write.partitionBy(partitionby).mode("append").parquet("s3://{0}/glue/csv2parquet/parquet/test".format(bucket_name),compression="snappy")

job.commit()