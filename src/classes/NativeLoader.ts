import { AddressIndex, BlockchainRpcConfig, KeychainKind, Network, Payload, WordCount } from '../lib/enums';
import { Balance, OutPoint, ScriptAmount, SignOptions, TransactionDetails } from './Bindings';

import { NativeModules } from 'react-native';

export interface NativeBdkRn {
  generateSeedFromWordCount(wordCount: WordCount): string;
  generateSeedFromString(mnemonic: string): string;
  generateSeedFromEntropy(entropy: Array<number>): string;

  createDerivationPath(path: string): string;

  createDescriptorSecret(network: Network, mnemonic: string, password?: string): string;
  descriptorSecretDerive(id: string, derivationPathId: string): string;
  descriptorSecretExtend(id: string, derivationPathId: string): string;
  descriptorSecretAsPublic(id: string): string;
  descriptorSecretAsSecretBytes(id: string): Array<number>;
  descriptorSecretAsString(id: string): string;

  createDescriptorPublic(id: string): string;
  descriptorPublicDerive(id: string, derivationPathId: string): string;
  descriptorPublicExtend(id: string, derivationPathId: string): string;
  descriptorPublicAsString(id: string): string;

  initElectrumBlockchain(
    url: string,
    sock5: string | null,
    retry: number,
    timeout: number,
    stopGap: number,
    validateDomain: boolean
  ): string;

  initEsploraBlockchain(
    baseUrl: string,
    proxy: string | null,
    concurrency: number,
    stopGap: number,
    timeout: number
  ): string;

  initRpcBlockchain(config: BlockchainRpcConfig): string;
  getBlockchainHeight(id: string): number;
  getBlockchainHash(id: string, height: number): string;
  broadcast(id: string, txId: string): boolean;
  estimateFee(id: string, target: number): number;

  memoryDBInit(): string;
  sledDBInit(path: string, treeName: string): string;
  sqliteDBInit(path: string): string;

  walletInit(descriptor: string, changeDescriptor: string | null, network: Network, dbConfig: string): any;
  getAddress(id: string, addressIndex: AddressIndex | number): any;
  getInternalAddress(id: string, addressIndex: AddressIndex | number): any;
  isMine(id: string, scriptId: string): boolean;
  getBalance(id: string): Balance;
  getNetwork(id: string): string;
  sync(blockchain: string, id: string): boolean;
  sign(id: string, psbtBase64: string, signOptions?: SignOptions): string;

  listUnspent(id: string): Array<any>;
  listTransactions(id: string, includeRaw: boolean): Array<TransactionDetails>;

  initAddress(address: string, network: string): string;
  addressFromScript(script: string, network: Network): string;
  addressToScriptPubkeyHex(id: string): string;
  addressPayload(id: string): Payload;
  addressNetwork(id: string): string;
  addressToQrUri(id: string): string;
  addressAsString(id: string): string;
  addressIsValidForNetwork(id: string, network: string): boolean;

  createTxBuilder(): string;
  addRecipient(id: string, scriptId: string, amount: number): string;
  finish(id: string, walletId: string): { base64: string; transactionDetails: any };

  addUnspendable(id: string, outPoint: OutPoint): boolean;
  addUtxo(id: string, outPoint: OutPoint): boolean;
  addUtxos(id: string, outPoints: Array<OutPoint>): boolean;
  doNotSpendChange(id: string): boolean;
  manuallySelectedOnly(id: string): boolean;
  onlySpendChange(id: string): boolean;
  unspendable(id: string, outPoints: Array<OutPoint>): boolean;

  feeRate(id: string, feeRate: number): boolean;
  feeAbsolute(id: string, feeRate: number): boolean;
  drainWallet(id: string): boolean;
  drainTo(id: string, scriptId: string): boolean;
  enableRbf(id: string): boolean;
  enableRbfWithSequence(id: string, nsequence: number): boolean;
  addData(id: string, data: Array<number>): boolean;
  setRecipients(id: string, recipients: Array<ScriptAmount>): boolean;

  createDescriptor(descriptor: string, network: string): string;
  descriptorAsString(id: string): string;
  descriptorAsStringPrivate(id: string): string;

  newBip44(id: string, keychain: KeychainKind, network: Network): string;
  newBip49(id: string, keychain: KeychainKind, network: Network): string;
  newBip84(id: string, keychain: KeychainKind, network: Network): string;
  newBip86(id: string, keychain: KeychainKind, network: Network): string;

  newBip44Public(id: string, fingerprint: string, keychain: KeychainKind, network: Network): string;
  newBip49Public(id: string, fingerprint: string, keychain: KeychainKind, network: Network): string;
  newBip84Public(id: string, fingerprint: string, keychain: KeychainKind, network: Network): string;
  newBip86Public(id: string, fingerprint: string, keychain: KeychainKind, network: Network): string;

  combine(psbt64: string, otherPsbt: string): string;
  extractTx(psbt64: string): string;
  serialize(psbt64: string): string;
  txid(psbt64: string): string;
  feeAmount(psbt64: string): number;
  psbtFeeRate(psbt64: string): number;
  jsonSerialize(psbt64: string): string;

  bumpFeeTxBuilderInit(txid: string, newFeeRate: number): string;
  bumpFeeTxBuilderAllowShrinking(id: string, scriptId: string): string;
  bumpFeeTxBuilderEnableRbf(id: string): any;
  bumpFeeTxBuilderEnableRbfWithSequence(id: string, nsequence: number): any;
  bumpFeeTxBuilderFinish(id: string, walletId: string): any;

  createTransaction(bytes: Array<number>): string;
  serializeTransaction(id: string): Array<number>;
  transactionTxid(id: string): string;
  txWeight(id: string): number;
  txSize(id: string): number;
  txVsize(id: string): number;
  txIsCoinBase(id: string): boolean;
  txIsExplicitlyRbf(id: string): boolean;
  txIsLockTimeEnabled(id: string): boolean;
  txVersion(id: string): number;
  txLockTime(id: string): number;
  txInput(id: string): Array<any>;
  txOutput(id: string): Array<any>;

  toBytes(id: string): Array<number>;
}

export class NativeLoader {
  protected _bdk: NativeBdkRn;

  constructor() {
    this._bdk = NativeModules.BdkRnModule;
  }
}
