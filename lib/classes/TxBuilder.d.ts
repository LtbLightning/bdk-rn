import { Wallet } from './Wallet';
import { OutPoint, Script } from './Bindings';
import { NativeLoader } from './NativeLoader';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
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
     * Finishes the transaction building
     * @param wallet
     * @returns
     */
    finish(wallet: Wallet): Promise<PartiallySignedTransaction>;
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
}
