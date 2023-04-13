import { OutPoint, Script, ScriptAmount, TxBuilderResult } from './Bindings';
import { NativeLoader } from './NativeLoader';
import { Wallet } from './Wallet';
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
    addRecipient(script: Script, amount: number): Promise<TxBuilder>;
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
     * @param {Array<outPoint>}
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
     * @param {Array<outPoint>}
     * @returns {Promise<TxBuilder>}
     */
    unspendable(outPoints: Array<OutPoint>): Promise<TxBuilder>;
    /**
     * Set a custom fee rate
     * @param {feeRate}
     * @returns {Promise<TxBuilder>}
     */
    feeRate(feeRate: number): Promise<TxBuilder>;
    /**
     * Set an absolute fee
     * @param {feeRate}
     * @returns {Promise<TxBuilder>}
     */
    feeAbsolute(feeRate: number): Promise<TxBuilder>;
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
     * @param {nsequence}
     * @returns {Promise<TxBuilder>}
     */
    enableRbfWithSequence(nsequence: number): Promise<TxBuilder>;
    /**
     * Add data as an output, using OP_RETURN
     * @param {data}
     * @returns {Promise<TxBuilder>}
     */
    addData(data: Array<number>): Promise<TxBuilder>;
    /**
     * Add number of receipents at once
     * @param {data}
     * @returns {Promise<TxBuilder>}
     */
    setRecipients(recipients: Array<ScriptAmount>): Promise<TxBuilder>;
    /**
     * Finishes the transaction building
     * @param wallet
     * @returns
     */
    finish(wallet: Wallet): Promise<TxBuilderResult>;
}
