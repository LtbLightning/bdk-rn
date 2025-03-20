import { NativeLoader } from './NativeLoader';
import { Script } from './Script';
import { OutPoint } from './Bindings';
import { Amount } from './Amount';
import { Wallet } from './Wallet';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
import { FeeRate } from './FeeRate';
/**
 * TxBuilder methods
 */
export declare class TxBuilder extends NativeLoader {
    id: string;
    /**
     * Create TxBuilder at native side
     * @returns {Promise<TxBuilder>}
     */
    create(): Promise<TxBuilder>;
    /**
     * Add recipient
     * @param script
     * @param amount
     * @returns {Promise<TxBuilder>}
     */
    addRecipient(script: Script, amount: Amount): Promise<TxBuilder>;
    /**
     * Add unspendable
     * @param outPoint
     * @returns {Promise<TxBuilder>}
     */
    addUnspendable(outPoint: OutPoint): Promise<TxBuilder>;
    /**
     * Add Utxo
     * @param outPoint
     * @returns {Promise<TxBuilder>}
     */
    addUtxo(outPoint: OutPoint): Promise<TxBuilder>;
    /**
     * Add Utxos
     * @param {Array<OutPoint>}
     * @returns {Promise<TxBuilder>}
     */
    addUtxos(outPoints: Array<OutPoint>): Promise<TxBuilder>;
    /**
     * Do not spend change outputs
     * @returns {Promise<TxBuilder>}
     */
    doNotSpendChange(): Promise<TxBuilder>;
    /**
     * Only spend utxos added by add_utxo
     * @returns {Promise<TxBuilder>}
     */
    manuallySelectedOnly(): Promise<TxBuilder>;
    /**
     * Only spend change outputs
     * @returns {Promise<TxBuilder>}
     */
    onlySpendChange(): Promise<TxBuilder>;
    /**
     * Add unspendable utxos list
     * @param {Array<OutPoint>}
     * @returns {Promise<TxBuilder>}
     */
    unspendable(outPoints: Array<OutPoint>): Promise<TxBuilder>;
    /**
     * Set a custom fee rate
     * @param {FeeRate}
     * @returns {Promise<TxBuilder>}
     */
    feeRate(feeRate: FeeRate): Promise<TxBuilder>;
    /**
     * Set an absolute fee
     * @param {Amount}
     * @returns {Promise<TxBuilder>}
     */
    feeAbsolute(fee: Amount): Promise<TxBuilder>;
    /**
     * Spend all the available inputs. This respects filters like TxBuilder().unSpendable and the change policy.
     * @returns {Promise<TxBuilder>}
     */
    drainWallet(): Promise<TxBuilder>;
    /**
     * Sets the address script to drain excess coins to.
     * @returns {Promise<TxBuilder>}
     */
    drainTo(script: Script): Promise<TxBuilder>;
    /**
     * Enable signaling RBF
     * @returns {Promise<TxBuilder>}
     */
    enableRbf(): Promise<TxBuilder>;
    /**
     * Enable signaling RBF with a specific nSequence value
     * @param {number}
     * @returns {Promise<TxBuilder>}
     */
    enableRbfWithSequence(nsequence: number): Promise<TxBuilder>;
    /**
     * Add data as an output, using OP_RETURN
     * @param {Array<number>}
     * @returns {Promise<TxBuilder>}
     */
    addData(data: Array<number>): Promise<TxBuilder>;
    /**
     * Add number of recipients at once
     * @param {Array<{script: Script; amount: Amount}>}
     * @returns {Promise<TxBuilder>}
     */
    setRecipients(recipients: Array<{
        script: Script;
        amount: Amount;
    }>): Promise<TxBuilder>;
    /**
     * Finishes the transaction building
     * @param wallet
     * @returns {Promise<PartiallySignedTransaction>}
     */
    finish(wallet: Wallet): Promise<PartiallySignedTransaction>;
}
