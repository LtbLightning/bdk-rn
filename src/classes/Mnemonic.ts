import { NativeLoader } from './NativeLoader';

enum WordCount {
  WORDS12 = 12,
  WORDS15 = 15,
  WORDS18 = 18,
  WORDS21 = 21,
  WORDS24 = 24,
}

/**
 * Mnemonic phrases are a human-readable version of the private keys.
 * Supported number of words are 12, 15, 18, and 24.
 */
class MnemonicInterface extends NativeLoader {
  private mnemonic: string = '';

  /**
   * Generates [Mnemonic] with given [WordCount]
   * @param wordCount
   * @returns {Promise<MnemonicInterface>}
   */
  async create(wordCount: WordCount = WordCount.WORDS12): Promise<MnemonicInterface> {
    if (!Object.values(WordCount).includes(wordCount)) throw 'Invalid word count passed';
    this.mnemonic = await this._bdk.generateMnemonicFromWordCount(wordCount);
    return this;
  }

  /**
   * Parse a [Mnemonic] with given string
   * @param mnemonic
   * @returns {Promise<MnemonicInterface>}
   */
  async fromString(mnemonic: string): Promise<MnemonicInterface> {
    this.mnemonic = await this._bdk.generateMnemonicFromString(mnemonic);
    return this;
  }

  /**
   * @returns {string}
   */
  asString(): string {
    return this.mnemonic;
  }
}

export const Mnemonic = new MnemonicInterface();
