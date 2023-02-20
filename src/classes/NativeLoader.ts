import { PartiallySignedTransaction } from 'bdk-rn/src/classes/PartiallySignedTransaction';
import { NativeModules } from 'react-native';
import { Network, WordCount, AddressIndex } from '../lib/enums';
import { AddressInfo, Balance, LocalUtxo, OutPoint, TransactionDetails } from './Bindings';
import { Blockchain } from './Blockchain';

export interface NativeBdkRn {
  generateSeedFromWordCount(wordCount: WordCount): string;
  generateSeedFromString(mnemonic: string): string;
  generateSeedFromEntropy(entropy: number): string;

  createDerivationPath(path: string): string;

  createDescriptorSecret(network: Network, mnemonic: string, password?: string): string;
  descriptorSecretDerive(path: string): string;
  descriptorSecretExtend(path: string): string;
  descriptorSecretAsPublic(): string;
  descriptorSecretAsSecretBytes(): Array<number>;

  createDescriptorPublic(publicKey: string): string;

  initElectrumBlockchain(url: string, retry: string, timeout: string, stopGap: string): string;
  initEsploraBlockchain(url: string, proxy: string, concurrency: string, timeout: string, stopGap: string): string;
  getBlockchainHeight(id: string): number;
  getBlockchainHash(id: string, height: number): string;
  broadcast(id: string, base64: string): boolean;

  memoryDBInit(): boolean;
  sledDBInit(path: string, treeName: string): boolean;
  sqliteDBInit(path: string): boolean;

  walletInit(descriptor: string, network: Network): any;
  getAddress(id: string, addressIndex: AddressIndex): AddressInfo;
  getBalance(id: string): Balance;
  getNetwork(id: string): string;
  sync(blockchain: string, id: string): boolean;
  sign(id: string, psbtId: string): boolean;

  listUnspent(id: string): Array<LocalUtxo>;
  listTransactions(id: string): Array<TransactionDetails>;

  initAddress(address: string): string;
  addressToScriptPubkeyHex(id: string): string;

  createTxBuilder(): string;
  addRecipient(id: string, scriptId: string, amount: number): string;
  finish(id: string, walletId: string): PartiallySignedTransaction;

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
  drainTo(id: string, address: string): boolean;
  enableRbf(id: string): boolean;
  enableRbfWithSequence(id: string, nsequence: number): boolean;
  addData(id: string, data: Array<number>): boolean;
}

export class NativeLoader {
  protected _bdk: NativeBdkRn = NativeModules.BdkRnModule;

  constructor() {
    this._bdk = NativeModules.BdkRnModule;
  }
}
