import { EntropyLength, WordCount } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Mnemonic phrases are a human-readable version of the private keys.
 * Supported number of words are 12, 15, 18, and 24.
 */
declare class MnemonicInterface extends NativeLoader {
    private mnemonic;
    /**
     * Generates [Mnemonic] with given [WordCount]
     * @param wordCount
     * @returns {Promise<MnemonicInterface>}
     */
    create(wordCount?: WordCount): Promise<MnemonicInterface>;
    /**
     * Parse a [Mnemonic] with given string
     * @param mnemonic
     * @returns {Promise<MnemonicInterface>}
     */
    fromString(mnemonic: string): Promise<MnemonicInterface>;
    /**
     * Generates [Mnemonic] with given [entropy]
     * @param entropy
     * @returns {Promise<MnemonicInterface>}
     */
    fromEntropy(entropy?: EntropyLength): Promise<MnemonicInterface>;
    /**
     * Get mnemonic as string
     * @returns {string}
     */
    asString(): string;
}
export declare const Mnemonic: MnemonicInterface;
export {};
