import pyarrow as pa
import pyarrow.parquet as pq
import pandas as pd

df = pd.read_csv('input/test.csv')

table = pa.Table.from_pandas(df)

pq.write_table(table, 'output/test.parquet')