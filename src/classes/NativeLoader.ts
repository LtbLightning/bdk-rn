import { NativeModules } from 'react-native';
import { Network, WordCount, BlockchainElectrumConfig, BlockchainEsploraConfig } from '../lib/enums';

interface NativeBdkRn {
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

  initElectrumBlockchain(url: string, retry: string, timeout: string, stopGap: string): number;
  initEsploraBlockchain(url: string, proxy: string, concurrency: string, timeout: string, stopGap: string): number;
  getBlockchainHeight(): number;
  getBlockchainHash(height: number): string;

  initWallet(descriptor: string, network: Network): any;

  memoryDBInit(): boolean;
  sledDBInit(path: string, treeName: string): boolean;
  sqliteDBInit(path: string): boolean;
}

export class NativeLoader {
  protected _bdk: NativeBdkRn = NativeModules.BdkRnModule;

  constructor() {
    this._bdk = NativeModules.BdkRnModule;
  }
}
