import { TxOut } from '../classes/Bindings';
import { NativeLoader } from './NativeLoader';
/**
 * Transaction methods
 */
export declare class Transaction extends NativeLoader {
    id: string;
    /**
     * Set Transaction from extractTx
     * @returns {Transaction}
     */
    _setTransaction(id: string): Transaction;
    /**
     * Create Transaction at native side
     * @returns {Promise<Transaction>}
     */
    create(bytes: Array<number>): Promise<Transaction>;
    /**
     * Return the transaction bytes, bitcoin consensus encoded.
     * @returns {Promise<Array<number>>}
     */
    serialize(): Promise<Array<number>>;
    txid(): Promise<string>;
    weight(): Promise<number>;
    size(): Promise<number>;
    vsize(): Promise<number>;
    isCoinBase(): Promise<boolean>;
    isExplicitlyRbf(): Promise<boolean>;
    isLockTimeEnabled(): Promise<boolean>;
    version(): Promise<number>;
    lockTime(): Promise<number>;
    input(): Promise<Array<any>>;
    output(): Promise<Array<TxOut>>;
}
