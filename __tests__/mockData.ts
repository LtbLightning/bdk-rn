import { BlockTime, TransactionDetails } from '../src/classes/Bindings';
import { DescriptorSecretKey, Wallet } from '../src/index';
import { Script } from '../src/classes/Script';

export const seedPhrase = 'mom mom mom mom mom mom mom mom mom mom mom mom';
export const descriptorString = 'descriptorString';
export const changeDescriptorString = 'changeDescriptorString';

export const mockWallet = new Wallet();
export const mockScript = new Script('mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB');

export const mockDescriptorSecret = new DescriptorSecretKey();

export const mockTransactionDetails = new TransactionDetails(
  'c9bb2ad8612a4774c903b1d9be86ecddb374e8fd43262802542d4c903bd9002e',
  7625,
  8564,
  141,
  new BlockTime(2410324, 1670479190),
  null
);

export const mockPayload = {
  type: 'witnessProgram',
  value: [198, 54, 185, 223, 2, 219, 35, 221, 90, 187, 88, 14, 183, 111, 223, 92, 163, 152, 168, 16],
  version: 'v0',
};

export const mockPsbtJson = {
  unsigned_tx: {
    version: 1,
    lock_time: 2426740,
    input: [
      {
        previous_output: 'a2b490dc5fbaf618e4cead8b7c78458d5504c434e802430c5d52f5fb081bc82b:0',
        script_sig: '',
        sequence: 4294967294,
        witness: [],
      },
      {
        previous_output: '49eb1cb9f7ab155431ef5e1f90a692340756c230d7e188d78bfe1a0c0cd8f7ab:0',
        script_sig: '',
        sequence: 4294967294,
        witness: [],
      },
    ],
    output: [
      { value: 1291, script_pubkey: '0014e21b7a1c7051c13c47c8158127a35abe29e9b204' },
      { value: 1500, script_pubkey: '001425ea2c044f293d8bfebd6009c5dac0ab61cf95be' },
    ],
  },
  version: 0,
  xpub: {},
  proprietary: [],
  unknown: [],
  inputs: [
    {
      non_witness_utxo: {
        version: 1,
        lock_time: 2421149,
        input: [
          {
            previous_output: 'aca5f4316631ffc4c6532223dda96a2d922b21cbcbbeb659762eba12557a49b5:1',
            script_sig: '',
            sequence: 4294967294,
            witness: [
              '30440220292066159e3c3fd1b84ed5f3bfd57315fa3c8bfd2cf83cf8ae8ee366d7e3dbac02205efa8855935fda6f052a99ea98b9233cc7f7bab03ae7641d6b0fa18575f9bd8901',
              '029a8f02900d0dfa456c6f4dfd629a233ed6fdce0c7ffec9f19c3652c6a3d06fc8',
            ],
          },
        ],
        output: [
          { value: 1500, script_pubkey: '001425ea2c044f293d8bfebd6009c5dac0ab61cf95be' },
          { value: 4241, script_pubkey: '001448b9ab06fe24e96b0cd93870514143dd88082d8f' },
        ],
      },
      witness_utxo: { value: 1500, script_pubkey: '001425ea2c044f293d8bfebd6009c5dac0ab61cf95be' },
      partial_sigs: {},
      sighash_type: null,
      redeem_script: null,
      witness_script: null,
      bip32_derivation: [
        ['02a7ebdcda93a7a506a8803abfd9fffa575d71c25bd2651c1e8d87d71c44210d00', ['09c0afde', "m/84'/1'/0'/0/7"]],
      ],
      final_script_sig: null,
      final_script_witness: null,
      ripemd160_preimages: {},
      sha256_preimages: {},
      hash160_preimages: {},
      hash256_preimages: {},
      tap_key_sig: null,
      tap_script_sigs: [],
      tap_scripts: [],
      tap_key_origins: [],
      tap_internal_key: null,
      tap_merkle_root: null,
      proprietary: [],
      unknown: [],
    },
    {
      non_witness_utxo: {
        version: 1,
        lock_time: 2423134,
        input: [
          {
            previous_output: 'd9ec9239f821b553e16a7775421ed52a9b8d5f125e93737908eeb3700bf2f6a2:1',
            script_sig: '',
            sequence: 4294967294,
            witness: [
              '3044022079745dc092087ec928bc2f3b7d957513b427d5b457f20bdd1690d15a7869cdd6022056e5c1e5aed3fe9b104327ec0c8fc0c28e9b449cef73c43c3d85e4b0e822fb1b01',
              '02a7ebdcda93a7a506a8803abfd9fffa575d71c25bd2651c1e8d87d71c44210d00',
            ],
          },
        ],
        output: [
          { value: 1500, script_pubkey: '001425ea2c044f293d8bfebd6009c5dac0ab61cf95be' },
          { value: 4241, script_pubkey: '001448b9ab06fe24e96b0cd93870514143dd88082d8f' },
        ],
      },
      witness_utxo: { value: 1500, script_pubkey: '001425ea2c044f293d8bfebd6009c5dac0ab61cf95be' },
      partial_sigs: {},
      sighash_type: null,
      redeem_script: null,
      witness_script: null,
      bip32_derivation: [
        ['02a7ebdcda93a7a506a8803abfd9fffa575d71c25bd2651c1e8d87d71c44210d00', ['09c0afde', "m/84'/1'/0'/0/7"]],
      ],
      final_script_sig: null,
      final_script_witness: null,
      ripemd160_preimages: {},
      sha256_preimages: {},
      hash160_preimages: {},
      hash256_preimages: {},
      tap_key_sig: null,
      tap_script_sigs: [],
      tap_scripts: [],
      tap_key_origins: [],
      tap_internal_key: null,
      tap_merkle_root: null,
      proprietary: [],
      unknown: [],
    },
  ],
  outputs: [
    {
      bip32_derivation: [
        ['02a7ebdcda93a7a506a8803abfd9fffa575d71c25bd2651c1e8d87d71c44210d00', ['09c0afde', "m/84'/1'/0'/0/8"]],
      ],
      redeem_script: null,
      witness_script: null,
      tap_internal_key: null,
      tap_tree: null,
      tap_key_origins: [],
      proprietary: [],
      unknown: [],
    },
    {
      bip32_derivation: [
        ['02a7ebdcda93a7a506a8803abfd9fffa575d71c25bd2651c1e8d87d71c44210d00', ['09c0afde', "m/84'/1'/0'/1/3"]],
      ],
      redeem_script: null,
      witness_script: null,
      tap_internal_key: null,
      tap_tree: null,
      tap_key_origins: [],
      proprietary: [],
      unknown: [],
    },
  ],
};

export const mockTxIn = {
  previous_output: {
    txid: 'a2b490dc5fbaf618e4cead8b7c78458d5504c434e802430c5d52f5fb081bc82b',
    vout: 0,
  },
  script_sig: '',
  sequence: 4294967294,
  witness: [],
};

export const mockTxOut = {
  value: 1291,
  script_pubkey: '0014e21b7a1c7051c13c47c8158127a35abe29e9b204',
};
