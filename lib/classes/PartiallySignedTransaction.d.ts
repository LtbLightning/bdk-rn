import { NativeLoader } from './NativeLoader';
import { Transaction } from './Transaction';
/**
 * A Partially Signed Transaction
 */
export declare class PartiallySignedTransaction extends NativeLoader {
    base64: string;
    constructor(base64: string);
    /**
     * Combines this [PartiallySignedTransaction] with other PSBT as described by BIP 174.
     * In accordance with BIP 174 this function is commutative i.e., `A.combine(B) == B.combine(A)`
     *
     * @returns {Promise<PartiallySignedTransaction>}
     */
    combine(other: PartiallySignedTransaction): Promise<PartiallySignedTransaction>;
    /**
     * Extract the final transaction from the PSBT.
     * @returns {Promise<Transaction>}
     */
    extractTx(): Promise<Transaction>;
    /**
     * Serialize the PSBT to hex format.
     * @returns {Promise<string>}
     */
    serialize(): Promise<string>;
    /**
     * Get the transaction ID (txid) of the PSBT.
     * @returns {Promise<string>}
     */
    txid(): Promise<string>;
}
