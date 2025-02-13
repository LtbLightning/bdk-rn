import { Transaction } from './Transaction';
import { ChainPosition } from './ChainPosition';
/**
 * CanonicalTx class to manage transaction and chain position
 */
export declare class CanonicalTx {
    transaction: Transaction;
    chainPosition: ChainPosition;
    constructor(transaction: Transaction, chainPosition: ChainPosition);
    /**
     * Creates a CanonicalTx instance by calling the native method.
     * @param transactionId - The ID of the transaction.
     * @param chainPositionId - The ID of the chain position.
     * @returns Promise<string> - Resolves to the CanonicalTx ID.
     */
    static createCanonicalTx(transactionId: string, chainPositionId: string): Promise<string>;
    /**
     * Retrieves a CanonicalTx instance by ID.
     * @param id - The CanonicalTx ID.
     * @returns Promise<CanonicalTx> - Resolves to a CanonicalTx object.
     */
    static getCanonicalTxById(id: string): Promise<CanonicalTx>;
}
