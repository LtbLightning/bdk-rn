import { NativeLoader } from './NativeLoader';
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
     * Finishes the transaction building
     * @param wallet
     * @returns
     */
    async finish(wallet) {
        let psbt = await this._bdk.finish(this.id, wallet.id);
        console.log('At module level', psbt);
        return psbt;
    }
}
//# sourceMappingURL=TxBuilder.js.map