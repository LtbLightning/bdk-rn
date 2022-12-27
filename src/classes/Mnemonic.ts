import { WordCount } from '../lib/enums';
import { NativeLoader } from './NativeLoader';

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
    this.mnemonic = await this._bdk.generateSeedFromWordCount(wordCount);
    return this;
  }

  /**
   * Parse a [Mnemonic] with given string
   * @param mnemonic
   * @returns {Promise<MnemonicInterface>}
   */
  async fromString(mnemonic: string): Promise<MnemonicInterface> {
    this.mnemonic = await this._bdk.generateSeedFromString(mnemonic);
    return this;
  }

  /**
   * Generates [Mnemonic] with given [entropy]
   * @param entropy
   * @returns {Promise<MnemonicInterface>}
   */
  async fromEntropy(entropy: number = Math.random()): Promise<MnemonicInterface> {
    this.mnemonic = await this._bdk.generateSeedFromEntropy(entropy);
    return this;
  }

  /**
   * Get mnemonic as string
   * @returns {string}
   */
  asString(): string {
    return this.mnemonic;
  }
}

export const Mnemonic = new MnemonicInterface();
