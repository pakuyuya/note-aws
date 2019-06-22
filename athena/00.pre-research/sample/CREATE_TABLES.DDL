CREATE EXTERNAL TABLE test (
    num int,
    some string,
    one string
    )
ROW FORMAT DELIMITED
      FIELDS TERMINATED BY ','
      ESCAPED BY '"'
      LINES TERMINATED BY '\n'
LOCATION 's3://paku-test-bucket/athena/test/';

CREATE EXTERNAL TABLE test_parquet (
    num int,
    some string,
    one string
    )
ROW FORMAT SERDE 'org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe'
WITH SERDEPROPERTIES (
  'serialization.format' = '1'
) LOCATION 's3://paku-test-bucket/athena/test_parquet/';

