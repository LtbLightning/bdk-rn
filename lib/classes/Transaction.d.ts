import { TxIn, TxOut } from '../classes/Bindings';
import { NativeLoader } from './NativeLoader';
/**
 * Transaction methods
 */
export declare class Transaction extends NativeLoader {
    id: string;
    constructor(id?: string);
    /**
     * Create Transaction at native side
     * @param {Array<number>} bytes - Transaction bytes
     * @returns {Promise<Transaction>}
     */
    static create(bytes: Array<number>): Promise<Transaction>;
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
    input(): Promise<Array<TxIn>>;
    output(): Promise<Array<TxOut>>;
    /**
     * Static method to create a Transaction from extracted data
     * @param {string} id - Transaction ID
     * @returns {Transaction}
     */
    static fromData(id: string): Transaction;
}
