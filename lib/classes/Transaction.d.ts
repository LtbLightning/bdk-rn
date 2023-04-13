import { NativeLoader } from './NativeLoader';
/**
 * Transaction methods
 */
export declare class Transaction extends NativeLoader {
    id: string;
    /**
     * Set Transaction from extractTx
     * @returns {Promise<Transaction>}
     */
    _setTransaction(id: string): Promise<Transaction>;
    /**
     * Create Transaction at native side
     * @returns {Promise<Transaction>}
     */
    create(bytes: Array<number>): Promise<Transaction>;
    /**
     * Return the transaction bytes, bitcoin consensus encoded.
     * @returns {Promise<Array<number>}
     */
    serialize(): Promise<Array<number>>;
}
