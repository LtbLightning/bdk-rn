import { NativeLoader } from './NativeLoader';
import { Script } from './Script';
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
        console.log('Script ID:', script.id);
        console.log('Amount:', amount);
        console.log('Amount Type:', typeof amount);
        if (typeof amount.asSats !== 'function') {
            throw new Error('Invalid amount object: asSats method is not defined.');
        }
        this._bdk.addRecipient(this.id, script.id, await amount.asSats());
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
     * @param {Array<OutPoint>}
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
     * @param {Array<OutPoint>}
     * @returns {Promise<TxBuilder>}
     */
    async unspendable(outPoints) {
        await this._bdk.unspendable(this.id, outPoints);
        return this;
    }
    // Note: The following methods are not present in the provided Swift code,
    // but I'm keeping them here in case they're implemented elsewhere or planned for future use.
    /**
     * Set a custom fee rate
     * @param {FeeRate}
     * @returns {Promise<TxBuilder>}
     */
    async feeRate(feeRate) {
        await this._bdk.feeRate(this.id, await feeRate.getSatPerVb());
        return this;
    }
    /**
     * Set an absolute fee
     * @param {Amount}
     * @returns {Promise<TxBuilder>}
     */
    async feeAbsolute(fee) {
        await this._bdk.feeAbsolute(this.id, await fee.toSats());
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
     * @param {number}
     * @returns {Promise<TxBuilder>}
     */
    async enableRbfWithSequence(nsequence) {
        await this._bdk.enableRbfWithSequence(this.id, nsequence);
        return this;
    }
    /**
     * Add data as an output, using OP_RETURN
     * @param {Array<number>}
     * @returns {Promise<TxBuilder>}
     */
    async addData(data) {
        await this._bdk.addData(this.id, data);
        return this;
    }
    /**
     * Add number of recipients at once
     * @param {Array<{script: Script; amount: Amount}>}
     * @returns {Promise<TxBuilder>}
     */
    async setRecipients(recipients) {
        const scriptAmounts = await Promise.all(recipients.map(async ({ script, amount }) => ({
            script: script.id,
            amount: await amount.asSats(),
        })));
        const scriptAmountsWithScript = scriptAmounts.map(({ script, amount }) => ({
            script: new Script(script),
            amount,
        }));
        await this._bdk.setRecipients(this.id, scriptAmountsWithScript);
        return this;
    }
    /**
     * Finishes the transaction building
     * @param wallet
     * @returns {Promise<PartiallySignedTransaction>}
     */
    async finish(wallet) {
        const psbtBase64 = await this._bdk.finish(this.id, wallet.id);
        return new PartiallySignedTransaction(psbtBase64.base64);
    }
}
//# sourceMappingURL=TxBuilder.js.map