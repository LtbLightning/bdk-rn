import { OutPoint, TxOut, KeychainKind } from './Bindings';
export declare class LocalOutput {
    outpoint: OutPoint;
    txout: TxOut;
    keychain: KeychainKind;
    isSpent: boolean;
    constructor(outpoint: OutPoint, txout: TxOut, keychain: KeychainKind, isSpent: boolean);
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
    getIsSpent(): boolean;
}
