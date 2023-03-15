import { WordCount } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Mnemonic phrases are a human-readable version of the private keys.
 * Supported number of words are 12, 15, 18, and 24.
 */
export class Mnemonic extends NativeLoader {
    constructor() {
        super(...arguments);
        this.mnemonic = '';
    }
    /**
     * Generates [Mnemonic] with given [WordCount]
     * @param wordCount
     * @returns {Promise<Mnemonic>}
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
     * @returns {Promise<Mnemonic>}
     */
    async fromString(mnemonic) {
        this.mnemonic = await this._bdk.generateSeedFromString(mnemonic);
        return this;
    }
    /**
     * Generates [Mnemonic] with given [entropy]
     * @param entropy
     * @returns {Promise<Mnemonic>}
     */
    async fromEntropy(entropy) {
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
//# sourceMappingURL=Mnemonic.js.map