import { ok, err, Result } from '@synonymdev/result';
import { NativeLoader } from './NativeLoader';

enum WordCount {
  WORDS12 = 12,
  WORDS15 = 15,
  WORDS18 = 18,
  WORDS21 = 21,
  WORDS24 = 24,
}

class MnemonicInterface extends NativeLoader {
  mnemonic: string = '';
  constructor(wordCount: WordCount = WordCount.WORDS12) {
    super();
  }

  async create(wordCount: WordCount = WordCount.WORDS12): Promise<Result<string>> {
    try {
      this.mnemonic = await this._bdk.generateMnemonic(wordCount);
      return ok(this.mnemonic);
    } catch (e: any) {
      return err(e);
    }
  }
}

export const Mnemonic = new MnemonicInterface();
