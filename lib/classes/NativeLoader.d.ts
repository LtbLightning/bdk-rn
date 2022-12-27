import { Network, WordCount } from '../lib/enums';
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
}
export declare class NativeLoader {
    protected _bdk: NativeBdkRn;
    constructor();
}
export {};
