import { WordCount } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Mnemonic phrases are a human-readable version of the private keys.
 * Supported number of words are 12, 15, 18, and 24.
 */
export declare class Mnemonic extends NativeLoader {
    private mnemonic;
    /**
     * Generates [Mnemonic] with given [WordCount]
     * @param wordCount
     * @returns {Promise<Mnemonic>}
     */
    create(wordCount?: WordCount): Promise<Mnemonic>;
    /**
     * Parse a [Mnemonic] with given string
     * @param mnemonic
     * @returns {Promise<Mnemonic>}
     */
    fromString(mnemonic: string): Promise<Mnemonic>;
    /**
     * Generates [Mnemonic] with given [entropy]
     * @param entropy
     * @returns {Promise<Mnemonic>}
     */
    fromEntropy(entropy: Array<number>): Promise<Mnemonic>;
    /**
     * Get mnemonic as string
     * @returns {string}
     */
    asString(): string;
}
