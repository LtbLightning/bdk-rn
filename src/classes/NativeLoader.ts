import { ChainPositionData } from './ChainPosition';
import { AddressIndex, BlockchainRpcConfig, KeychainKind, Network, Payload, WordCount } from '../lib/enums';
import {
  Address,
  AddressInfo,
  Balance,
  LocalUtxo,
  OutPoint,
  ScriptAmount,
  SignOptions,
  TransactionDetails,
} from './Bindings';

import { NativeModules } from 'react-native';
import { SentAndReceivedValues } from './SentAndReceivedValues';

export interface NativeBdkRn {
  generateSeedFromWordCount(wordCount: WordCount): string;
  generateSeedFromString(mnemonic: string): string;
  generateSeedFromEntropy(entropy: Array<number>): string;

  createDerivationPath(path: string): string;
  derivationPathToString(id: string): string;
  createDescriptorSecretKey(network: Network, mnemonic: string, password?: string): string;
  descriptorSecretKeyDerive(id: string, derivationPathId: string): string;
  descriptorSecretKeyExtend(id: string, derivationPathId: string): string;
  descriptorSecretKeyAsPublic(id: string): string;
  descriptorSecretKeySecretBytes(id: string): Array<number>;
  descriptorSecretKeyFromString(id: string): string;
  descriptorSecretKeyAsString(id: string): string;

  createDescriptorPublic(publicKey: string): Promise<string>;
  descriptorPublicDerive(id: string, path: string): Promise<string>;
  descriptorPublicExtend(id: string, path: string): Promise<string>;
  descriptorPublicAsString(id: string): Promise<string>;
  descriptorPublicKeyAsBytes(id: string): Array<number>;

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

  amountAsSats(amount: number): number;
  amountAsBtc(amount: number): number;
  initRpcBlockchain(config: BlockchainRpcConfig): string;
  getBlockchainHeight(id: string): number;
  getBlockchainHash(id: string, height: number): string;
  broadcast(id: string, txId: string): boolean;
  estimateFee(id: string, target: number): number;

  memoryDBInit(): string;
  sledDBInit(path: string, treeName: string): string;
  sqliteDBInit(path: string): string;

  walletInit(descriptor: string, changeDescriptor: string | null, network: Network, dbConfig: string): any;
  revealNextAddress(id: string, addressIndex: AddressIndex | number): any;
  isMine(id: string, scriptId: string): boolean;
  getBalance(id: string): Balance;
  getBalanceImmature(id: string): number;
  getBalanceTrustedPending(id: string): number;
  getBalanceUntrustedPending(id: string): number;
  getBalanceConfirmed(id: string): number;
  getBalanceTrustedSpendable(id: string): number;
  getBalanceTotal(id: string): number;
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
  createChainPosition(position: ChainPositionData): string;
  getChainPositionType(id: string): string;
  getChainPositionData(id: string): ChainPositionData;

  feeRateToSatPerVbCeil(id: string): number;
  feeRateToSatPerVbFloor(id: string): number;
  feeRateToSatPerKwu(id: string): number;

  getLocalOutputOutpoint(id: string): string;
  getLocalOutputTxout(id: string): string;
  getLocalOutputKeychain(id: string): string;
  isLocalOutputSpent(id: string): boolean;

  createElectrumClient(url: string): string;
  electrumClientBroadcast(clientId: string, transactionId: string): boolean;
  electrumClientFullScan(
    clientId: string,
    fullScanRequest: string,
    stopGap: number,
    batchSize: number,
    fetchPrevTxouts: boolean
  ): string;
  electrumClientSync(clientId: string, syncRequest: string, batchSize: number, fetchPrevTxouts: boolean): string;
  createAddressInfo(index: number, addressId: string, keychain: string): string;
  getAddressInfoIndex(id: string): number;
  getAddressInfoAddress(id: string): string;
  getAddressInfoKeychain(id: string): string;
  createEsploraClient(url: string): string;
  esploraClientBroadcast(clientId: string, transactionId: string): boolean;
  esploraClientSync(clientId: string, syncRequest: string, parallelRequests: number): string;
  esploraClientFullScan(clientId: string, fullScanRequest: string, stopGap: number, parallelRequests: number): string;
  createSyncRequest(walletId: string): string;
  getSyncRequestHeight(id: string): number;
  getSyncRequestWalletId(id: string): string;
  getSyncRequestRange(id: string): Array<number>;
  getSyncRequestFetchPrevTxouts(id: string): boolean;
  getSyncRequestParallelRequests(id: string): number;
  freeSyncRequest(id: string): void;
  createFullScanRequest(walletId: string): string;
  freeFullScanRequest(id: string): void;
  getAddress(id: string): Address;
  freeAddress(id: string): void;
  getNetwork(id: string): Network;
  freeNetwork(id: string): void;
  createSentAndReceivedValues(sent: number, received: number): string; // Assuming Amount can be represented as number
  freeSentAndReceivedValues(values: SentAndReceivedValues): void;

  walletSync(
    walletId: string,
    syncRequest: string,
    blockchain: string,
    batchSize: number,
    fetchPrevTxouts: boolean
  ): void;
  walletStartSyncWithRevealedSpks(walletId: string): string;
  walletApplyUpdate(walletId: string, updateId: string): void;
  walletGetTransactions(walletId: string, includeRaw: boolean): Array<TransactionDetails>;
  walletGetBalance(walletId: string): Balance;
  walletGetBalanceImmature(walletId: string): number;
  walletGetBalanceTrustedPending(walletId: string): number;
  walletGetBalanceUntrustedPending(walletId: string): number;
  walletGetBalanceConfirmed(walletId: string): number;
  walletGetBalanceTrustedSpendable(walletId: string): number;
  walletGetBalanceTotal(walletId: string): number;
  walletCalculateFee(walletId: string, transactionId: string): number;
  walletCalculateFeeRate(walletId: string, transactionId: string): string;
  walletCommit(walletId: string): boolean;
  walletGetNextAddress(walletId: string, addressIndex: AddressIndex | number): Address;
  walletGetNextInternalAddress(walletId: string, addressIndex: AddressIndex | number): Address;
  walletGetNextChangeAddress(walletId: string): Address;
  walletGetNextChangeInternalAddress(walletId: string): Address;
  walletGetNextReceivingAddress(walletId: string): Address;
  walletGetNextReceivingInternalAddress(walletId: string): Address;
  walletGetNextChangeAddressIndex(walletId: string): number;
  walletGetNextReceivingAddressIndex(walletId: string): number;
  walletGetTx(walletId: string, txid: string): TransactionDetails | null;
  walletListOutput(walletId: string): Array<LocalUtxo>;
  walletRevealNextAddress(walletId: string, keychain: KeychainKind): AddressInfo;
  walletSentAndReceived(walletId: string, transactionId: string): { sent: number; received: number };
  walletStartFullScan(walletId: string): string;
  walletTransactions(walletId: string, includeRaw: boolean): Array<TransactionDetails>;
  walletSign(walletId: string, psbtId: string): string;
  walletNetwork(walletId: string): Network;
  walletListUnspent(walletId: string): Array<LocalUtxo>;
  walletIsMine(walletId: string, scriptId: string): boolean;

  createScripwalletStartFullScan(walletId: string): string;
  t(rawOutputScript: Array<number>): Promise<string>;
  scriptToBytes(id: string): Promise<Array<number>>;
}

export class NativeLoader {
  protected _bdk: NativeBdkRn;

  constructor() {
    this._bdk = NativeModules.BdkRnModule;
  }
}
