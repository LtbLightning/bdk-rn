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
     * Return the transaction as bytes.
     * @returns {Promise<any>}
     */
    extractTx(): Promise<Transaction>;
    /**
     * Return transaction as string
     * @returns {Promise<string>}
     */
    serialize(): Promise<string>;
    /**
     * Return txid as string
     * @returns {Promise<string>}
     */
    txid(): Promise<string>;
    /**
     * Return feeAmount
     * @returns {Promise<number>}
     */
    feeAmount(): Promise<number>;
    /**
     * Return feeRate
     * @returns {Promise<number>}
     */
    feeRate(): Promise<number>;
    /**
     * Return transaction as json
     * @returns {Promise<string>}
     */
    jsonSerialize(): Promise<string>;
}
