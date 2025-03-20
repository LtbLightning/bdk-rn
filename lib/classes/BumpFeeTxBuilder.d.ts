import { FeeRate } from './FeeRate';
import { NativeLoader } from './NativeLoader';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
import { Wallet } from './Wallet';
/**
 * BumpFeeTxBuilder methods
 * The BumpFeeTxBuilder is used to bump the fee on a transaction that has been broadcast and has its RBF flag set to true.
 */
export declare class BumpFeeTxBuilder extends NativeLoader {
    id: string;
    /**
     * Create a new BumpFeeTxBuilder
     * @param txid The transaction ID of the transaction to bump
     * @param newFeeRate The new fee rate to use
     * @returns {Promise<BumpFeeTxBuilder>}
     */
    create(txid: string, newFeeRate: FeeRate): Promise<BumpFeeTxBuilder>;
    /**
     * Enable signaling RBF
     * This will use the default nSequence value of `0xFFFFFFFD`
     *
     * @returns {Promise<BumpFeeTxBuilder>}
     */
    enableRbf(): Promise<BumpFeeTxBuilder>;
    /**
     * Enable signaling RBF with a specific nSequence value
     *
     * This can cause conflicts if the wallet's descriptors contain an "older" (OP_CSV) operator and the given nsequence is lower than the CSV value.
     *
     * If the nsequence is higher than `0xFFFFFFFD` an error will be thrown, since it would not be a valid nSequence to signal RBF.
     * @param nSequence
     * @returns {Promise<BumpFeeTxBuilder>}
     */
    enableRbfWithSequence(nSequence: number): Promise<BumpFeeTxBuilder>;
    /**
     * Finish building the transaction.
     * @param wallet
     * @returns {Promise<PartiallySignedTransaction>}
     */
    finish(wallet: Wallet): Promise<PartiallySignedTransaction>;
}
