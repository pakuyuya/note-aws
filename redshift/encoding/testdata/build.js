const fs = require('fs');
const crypto = require('crypto');
const zlib = require('zlib');

const records = 10 * 1000 * 1000;
const LF = '\n';


require('./sub/address_sequence')('address_sequence.gz', records)
require('./sub/numbers_0toMAX')('numbers_0toMAX.gz', records)
require('./sub/numbers_sequence_loop')('numbers_0to10_bst1_loop.gz', records, 1, 10, 1, 0)
require('./sub/numbers_sequence_loop')('numbers_0to10_bst10_loop.gz', records, 10, 10, 1, 0)
require('./sub/numbers_sequence_loop')('numbers_0to10_bst100_loop.gz', records, 100, 10, 1, 0)
require('./sub/numbers_sequence_loop')('numbers_0to10_bst1000_loop.gz', records, 1000, 10, 1, 0)
require('./sub/numbers_sequence_loop')('numbers_10kto100k_bst1_stp10k_loop.gz', records, 1, 10, 10000, 10000)
require('./sub/numbers_sequence_loop')('numbers_10kto100k_bst1000_stp10k_loop.gz', records, 1000, 10, 10000, 10000)
require('./sub/numbers_sequence_loop')('numbers_10Mto100M_bst1_stp10M_loop.gz', records, 1, 10, 10000000, 10000000)
require('./sub/numbers_0to100000_shuffle_val30')('numbers_0to100000_shuffle_val30.gz', records)
require('./sub/numbers_0to100000_shuffle_val30_modfrequency')('numbers_0to100000_shuffle_val30_modfrequency.gz', records)
require('./sub/pref_sequence')('pref_bst1_loop.gz', records, 1)
require('./sub/pref_sequence')('pref_bst100_loop.gz', records, 100)
require('./sub/pref_sequence_shuffle_modfrequency')('prefs_sequence_shuffle_modfrequency.gz', records)
require('./sub/sha256')('sha256.gz', records)
