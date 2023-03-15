import { NativeLoader } from './NativeLoader';
/**
 * A Partially Signed Transaction
 */
export declare class PartiallySignedTransaction extends NativeLoader {
    base64: string;
    signedBase64: string;
    constructor(base64: string);
    setSignedPsbt(sbt: string): PartiallySignedTransaction;
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
    extractTx(): Promise<any>;
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
}
