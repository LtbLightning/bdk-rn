import { createTxDetailsObject } from '../lib/utils';
import { TxBuilderResult } from './Bindings';
import { NativeLoader } from './NativeLoader';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
/**
 * TxBuilder methods
 */
export class TxBuilder extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
    }
    /**
     * Create TxBuilder at native side
     * @returns {Promise<TxBuilder>}
     */
    async create() {
        this.id = await this._bdk.createTxBuilder();
        return this;
    }
    /**
     * Add recipient
     * @param script
     * @param amount
     * @returns {Promise<TxBuilder>}
     */
    async addRecipient(script, amount) {
        await this._bdk.addRecipient(this.id, script.id, amount);
        return this;
    }
    /**
     * Add unspendable
     * @param outPoint
     * @returns {Promise<TxBuilder>}
     */
    async addUnspendable(outPoint) {
        await this._bdk.addUnspendable(this.id, outPoint);
        return this;
    }
    /**
     * Add Utxo
     * @param outPoint
     * @returns {Promise<TxBuilder>}
     */
    async addUtxo(outPoint) {
        await this._bdk.addUtxo(this.id, outPoint);
        return this;
    }
    /**
     * Add Utxos
     * @param {Array<outPoint>}
     * @returns {Promise<TxBuilder>}
     */
    async addUtxos(outPoints) {
        await this._bdk.addUtxos(this.id, outPoints);
        return this;
    }
    /**
     * Do not spend change outputs
     * @returns {Promise<TxBuilder>}
     */
    async doNotSpendChange() {
        await this._bdk.doNotSpendChange(this.id);
        return this;
    }
    /**
     * Only spend utxos added by add_utxo
     * @returns {Promise<TxBuilder>}
     */
    async manuallySelectedOnly() {
        await this._bdk.manuallySelectedOnly(this.id);
        return this;
    }
    /**
     * Only spend change outputs
     * @returns {Promise<TxBuilder>}
     */
    async onlySpendChange() {
        await this._bdk.onlySpendChange(this.id);
        return this;
    }
    /**
     * Add unspendable utxos list
     * @param {Array<outPoint>}
     * @returns {Promise<TxBuilder>}
     */
    async unspendable(outPoints) {
        await this._bdk.unspendable(this.id, outPoints);
        return this;
    }
    /**
     * Set a custom fee rate
     * @param {feeRate}
     * @returns {Promise<TxBuilder>}
     */
    async feeRate(feeRate) {
        await this._bdk.feeRate(this.id, feeRate);
        return this;
    }
    /**
     * Set an absolute fee
     * @param {feeRate}
     * @returns {Promise<TxBuilder>}
     */
    async feeAbsolute(feeRate) {
        await this._bdk.feeAbsolute(this.id, feeRate);
        return this;
    }
    /**
     * Spend all the available inputs. This respects filters like TxBuilder().unSpendable and the change policy.
     * @returns {Promise<TxBuilder>}
     */
    async drainWallet() {
        await this._bdk.drainWallet(this.id);
        return this;
    }
    /**
     * Sets the address script to drain excess coins to.
     * @returns {Promise<TxBuilder>}
     */
    async drainTo(script) {
        await this._bdk.drainTo(this.id, script.id);
        return this;
    }
    /**
     * Enable signaling RBF
     * @returns {Promise<TxBuilder>}
     */
    async enableRbf() {
        await this._bdk.enableRbf(this.id);
        return this;
    }
    /**
     * Enable signaling RBF with a specific nSequence value
     * @param {nsequence}
     * @returns {Promise<TxBuilder>}
     */
    async enableRbfWithSequence(nsequence) {
        await this._bdk.enableRbfWithSequence(this.id, nsequence);
        return this;
    }
    /**
     * Add data as an output, using OP_RETURN
     * @param {data}
     * @returns {Promise<TxBuilder>}
     */
    async addData(data) {
        await this._bdk.addData(this.id, data);
        return this;
    }
    /**
     * Add number of receipents at once
     * @param {data}
     * @returns {Promise<TxBuilder>}
     */
    async setRecipients(recipients) {
        await this._bdk.setRecipients(this.id, recipients);
        return this;
    }
    /**
     * Finishes the transaction building
     * @param wallet
     * @returns
     */
    async finish(wallet) {
        let response = await this._bdk.finish(this.id, wallet.id);
        let psbt = new PartiallySignedTransaction(response.base64);
        return new TxBuilderResult(psbt, createTxDetailsObject(response.transactionDetails));
    }
}
//# sourceMappingURL=TxBuilder.js.map