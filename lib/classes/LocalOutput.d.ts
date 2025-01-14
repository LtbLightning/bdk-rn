import { NativeLoader } from './NativeLoader';
import { OutPoint, TxOut, LocalUtxo, KeychainKind } from './Bindings';
export declare class LocalOutput extends NativeLoader {
    private localUtxo;
    private static _bdk;
    constructor(localUtxo: LocalUtxo);
    /**
     * Get the outpoint of the local output
     * @returns {OutPoint}
     */
    getOutpoint(): OutPoint;
    /**
     * Get the TxOut of the local output
     * @returns {TxOut}
     */
    getTxout(): TxOut;
    /**
     * Get the keychain kind of the local output
     * @returns {KeychainKind}
     */
    getKeychain(): KeychainKind;
    /**
     * Check if the local output is spent
     * @returns {boolean}
     */
    isSpent(): boolean;
    /**
     * Create a LocalOutput instance from native data
     * @param {string} id - The id returned from native code
     * @returns {Promise<LocalOutput>}
     */
    static fromId(id: string): Promise<LocalOutput>;
}
