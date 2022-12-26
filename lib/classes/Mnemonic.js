import { ok, err } from '@synonymdev/result';
import { NativeLoader } from './NativeLoader';
var WordCount;
(function (WordCount) {
    WordCount[WordCount["WORDS12"] = 12] = "WORDS12";
    WordCount[WordCount["WORDS15"] = 15] = "WORDS15";
    WordCount[WordCount["WORDS18"] = 18] = "WORDS18";
    WordCount[WordCount["WORDS21"] = 21] = "WORDS21";
    WordCount[WordCount["WORDS24"] = 24] = "WORDS24";
})(WordCount || (WordCount = {}));
class MnemonicInterface extends NativeLoader {
    constructor(wordCount = WordCount.WORDS12) {
        super();
        this.mnemonic = '';
    }
    async create(wordCount = WordCount.WORDS12) {
        try {
            this.mnemonic = await this._bdk.generateMnemonic(wordCount);
            return ok(this.mnemonic);
        }
        catch (e) {
            return err(e);
        }
    }
}
export const Mnemonic = new MnemonicInterface();
//# sourceMappingURL=Mnemonic.js.map