import { NativeLoader } from './NativeLoader';
var WordCount;
(function (WordCount) {
    WordCount[WordCount["WORDS12"] = 12] = "WORDS12";
    WordCount[WordCount["WORDS15"] = 15] = "WORDS15";
    WordCount[WordCount["WORDS18"] = 18] = "WORDS18";
    WordCount[WordCount["WORDS21"] = 21] = "WORDS21";
    WordCount[WordCount["WORDS24"] = 24] = "WORDS24";
})(WordCount || (WordCount = {}));
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
        this.mnemonic = await this._bdk.generateMnemonicFromWordCount(wordCount);
        return this;
    }
    /**
     * Parse a [Mnemonic] with given string
     * @param mnemonic
     * @returns {Promise<MnemonicInterface>}
     */
    async fromString(mnemonic) {
        this.mnemonic = await this._bdk.generateMnemonicFromString(mnemonic);
        return this;
    }
    /**
     * @returns {string}
     */
    asString() {
        return this.mnemonic;
    }
}
export const Mnemonic = new MnemonicInterface();
//# sourceMappingURL=Mnemonic.js.map