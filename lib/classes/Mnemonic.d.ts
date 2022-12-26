import { Result } from '@synonymdev/result';
import { NativeLoader } from './NativeLoader';
declare enum WordCount {
    WORDS12 = 12,
    WORDS15 = 15,
    WORDS18 = 18,
    WORDS21 = 21,
    WORDS24 = 24
}
declare class MnemonicInterface extends NativeLoader {
    mnemonic: string;
    constructor(wordCount?: WordCount);
    create(wordCount?: WordCount): Promise<Result<string>>;
}
export declare const Mnemonic: MnemonicInterface;
export {};
