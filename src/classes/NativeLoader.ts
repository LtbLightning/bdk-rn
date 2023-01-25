import { NativeModules } from 'react-native';
import { Network, WordCount, AddressIndex } from '../lib/enums';
import { AddressInfo, Balance, LocalUtxo, TransactionDetails } from './Bindings';
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

  memoryDBInit(): boolean;
  sledDBInit(path: string, treeName: string): boolean;
  sqliteDBInit(path: string): boolean;

  initWallet(descriptor: string, network: Network): any;
  getAddress(id: string, addressIndex: AddressIndex): AddressInfo;
  getBalance(id: string): Balance;
  getNetwork(id: string): string;
  sync(blockchain: string, id: string): boolean;

  listUnspent(id: string): Array<LocalUtxo>;
  listTransactions(id: string): Array<TransactionDetails>;
}

export class NativeLoader {
  protected _bdk: NativeBdkRn = NativeModules.BdkRnModule;

  constructor() {
    this._bdk = NativeModules.BdkRnModule;
  }
}
