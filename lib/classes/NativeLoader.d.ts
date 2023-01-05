import { Network, WordCount, AddressIndex } from '../lib/enums';
import { AddressInfo, Balance } from './Bindings';
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
    memoryDBInit(): boolean;
    sledDBInit(path: string, treeName: string): boolean;
    sqliteDBInit(path: string): boolean;
    initWallet(descriptor: string, network: Network): any;
    getAddress(addressIndex: AddressIndex): AddressInfo;
    getBalance(): Balance;
    getNetwork(): string;
    sync(): boolean;
    listUnspent(): any;
    listTransactions(): any;
}
export declare class NativeLoader {
    protected _bdk: NativeBdkRn;
    constructor();
}
export {};
