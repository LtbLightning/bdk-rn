import { EntropyLength, WordCount } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Mnemonic phrases are a human-readable version of the private keys.
 * Supported number of words are 12, 15, 18, and 24.
 */
class MnemonicInterface extends NativeLoader {
    constructor() {
        super(...arguments);
        this.mnemonic = '';
    }
    /**
     * Generates [Mnemonic] with given [WordCount]
     * @param wordCount
     * @returns {Promise<MnemonicInterface>}
     */
    async create(wordCount = WordCount.WORDS12) {
        if (!Object.values(WordCount).includes(wordCount))
            throw 'Invalid word count passed';
        this.mnemonic = await this._bdk.generateSeedFromWordCount(wordCount);
        return this;
    }
    /**
     * Parse a [Mnemonic] with given string
     * @param mnemonic
     * @returns {Promise<MnemonicInterface>}
     */
    async fromString(mnemonic) {
        this.mnemonic = await this._bdk.generateSeedFromString(mnemonic);
        return this;
    }
    /**
     * Generates [Mnemonic] with given [entropy]
     * @param entropy
     * @returns {Promise<MnemonicInterface>}
     */
    async fromEntropy(entropy = EntropyLength.Length16) {
        if (!Object.values(EntropyLength).includes(entropy))
            throw 'Invalid entropy length passed';
        this.mnemonic = await this._bdk.generateSeedFromEntropy(entropy);
        return this;
    }
    /**
     * Get mnemonic as string
     * @returns {string}
     */
    asString() {
        return this.mnemonic;
    }
}
export const Mnemonic = new MnemonicInterface();
//# sourceMappingURL=Mnemonic.js.map