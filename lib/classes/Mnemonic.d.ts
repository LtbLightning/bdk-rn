import { NativeLoader } from './NativeLoader';
declare enum WordCount {
    WORDS12 = 12,
    WORDS15 = 15,
    WORDS18 = 18,
    WORDS21 = 21,
    WORDS24 = 24
}
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
     * @returns {string}
     */
    asString(): string;
}
export declare const Mnemonic: MnemonicInterface;
export {};
