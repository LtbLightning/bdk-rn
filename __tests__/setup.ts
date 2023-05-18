export const mockBdkRnModule = {
  generateSeedFromWordCount: jest.fn(),
  generateSeedFromString: jest.fn(),
  generateSeedFromEntropy: jest.fn(),

  createDerivationPath: jest.fn(),

  createDescriptorSecret: jest.fn(),
  descriptorSecretDerive: jest.fn(),
  descriptorSecretExtend: jest.fn(),
  descriptorSecretAsPublic: jest.fn(),
  descriptorSecretAsSecretBytes: jest.fn(),
  descriptorSecretAsString: jest.fn(),

  createDescriptorPublic: jest.fn(),
  descriptorPublicDerive: jest.fn(),
  descriptorPublicExtend: jest.fn(),
  descriptorPublicAsString: jest.fn(),

  initElectrumBlockchain: jest.fn(),
  initEsploraBlockchain: jest.fn(),
  initRpcBlockchain: jest.fn(),
  getBlockchainHeight: jest.fn(),
  getBlockchainHash: jest.fn(),
  broadcast: jest.fn(),
  estimateFee: jest.fn(),

  memoryDBInit: jest.fn(),
  sledDBInit: jest.fn(),
  sqliteDBInit: jest.fn(),

  walletInit: jest.fn(),
  getAddress: jest.fn(),
  getBalance: jest.fn(),
  getNetwork: jest.fn(),
  sync: jest.fn(),
  sign: jest.fn(),

  listUnspent: jest.fn(),
  listTransactions: jest.fn(),

  initAddress: jest.fn(),
  addressToScriptPubkeyHex: jest.fn(),

  addRecipient: jest.fn(),
  finish: jest.fn(),

  addUnspendable: jest.fn(),
  addUtxo: jest.fn(),
  addUtxos: jest.fn(),
  doNotSpendChange: jest.fn(),
  manuallySelectedOnly: jest.fn(),
  onlySpendChange: jest.fn(),
  unspendable: jest.fn(),

  feeRate: jest.fn(),
  feeAbsolute: jest.fn(),
  drainWallet: jest.fn(),
  drainTo: jest.fn(),
  enableRbf: jest.fn(),
  enableRbfWithSequence: jest.fn(),
  addData: jest.fn(),
  setRecipients: jest.fn(),

  createDescriptor: jest.fn(),
  descriptorAsString: jest.fn(),
  descriptorAsStringPrivate: jest.fn(),

  newBip44: jest.fn(),
  newBip49: jest.fn(),
  newBip84: jest.fn(),

  newBip44Public: jest.fn(),
  newBip49Public: jest.fn(),
  newBip84Public: jest.fn(),

  combine: jest.fn(),
  extractTx: jest.fn(),
  serialize: jest.fn(),
  txid: jest.fn(),
  feeAmount: jest.fn(),
  psbtFeeRate: jest.fn(),

  bumpFeeTxBuilderInit: jest.fn(),
  bumpFeeTxBuilderAllowShrinking: jest.fn(),
  bumpFeeTxBuilderEnableRbf: jest.fn(),
  bumpFeeTxBuilderEnableRbfWithSequence: jest.fn(),
  bumpFeeTxBuilderFinish: jest.fn(),

  createTransaction: jest.fn(),
  serializeTransaction: jest.fn(),
};

jest.mock('react-native', () => ({
  NativeModules: {
    BdkRnModule: mockBdkRnModule,
  },
}));
