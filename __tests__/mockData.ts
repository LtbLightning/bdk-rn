import { BlockTime, TransactionDetails } from '../src/classes/Bindings';
import { DescriptorSecretKey, Wallet } from '../src/index';
import { createTxIn, createTxOut } from '../src/lib/utils';

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
          {
            previous_output: '9ed94d88e239d7e3bf9277093b3144e15772a5f735601249a465ee98ef153e92:1',
            script_sig: '',
            sequence: 4294967294,
            witness: [
              '304402205334e43be3c86c558555b65197aca08bbcadfe10981265628cfac916bd44e39f022006d344b36f23c96c9c385ca337bc98765392b0217d04317b18b2e005713d8bc901',
              '033620f8e6d811b6fae563a4021d348fabfcb27804688d23333d559380eeed1e2b',
            ],
          },
        ],
        output: [
          { value: 1500, script_pubkey: '001425ea2c044f293d8bfebd6009c5dac0ab61cf95be' },
          { value: 6832, script_pubkey: '00144084734282d87eb5f4a5d0c8cda4db373b8ec512' },
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
      redeem_script: null,
      witness_script: null,
      bip32_derivation: [
        ['023645eb2482a90146ec31257b50dba5d589125aa259e1f37d740ea9191dc664cd', ['09c0afde', "m/84'/1'/0'/0/9"]],
      ],
      tap_internal_key: null,
      tap_tree: null,
      tap_key_origins: [],
      proprietary: [],
      unknown: [],
    },
    {
      redeem_script: null,
      witness_script: null,
      bip32_derivation: [
        ['02a7ebdcda93a7a506a8803abfd9fffa575d71c25bd2651c1e8d87d71c44210d00', ['09c0afde', "m/84'/1'/0'/0/7"]],
      ],
      tap_internal_key: null,
      tap_tree: null,
      tap_key_origins: [],
      proprietary: [],
      unknown: [],
    },
  ],
};

export const mockScriptBytes = [
  0, 20, 210, 204, 2, 139, 206, 150, 12, 235, 13, 89, 8, 111, 17, 48, 108, 255, 191, 119, 63, 50,
];

export const mockTxIn = {
  previousOutput: { txid: 'a2b490dc5fbaf618e4cead8b7c78458d5504c434e802430c5d52f5fb081bc82b', vout: 0 },
  scriptSig: 'E97B07C0-2B22-48E6-A031-70EF9F4EF4DB',
  sequence: 4294967294,
  witness: [],
};

export const mockTxOut = { script: 'EE6FAD9E-EFF3-4EDA-A8C6-4BCE6E35275F', value: 1291 };
