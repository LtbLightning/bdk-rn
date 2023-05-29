import { NativeLoader } from './NativeLoader';
/**
 * Transaction methods
 */
export class Transaction extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
    }
    /**
     * Set Transaction from extractTx
     * @returns {Promise<Transaction>}
     */
    async _setTransaction(id) {
        this.id = id;
        return this;
    }
    /**
     * Create Transaction at native side
     * @returns {Promise<Transaction>}
     */
    async create(bytes) {
        this.id = await this._bdk.createTransaction(bytes);
        return this;
    }
    /**
     * Return the transaction bytes, bitcoin consensus encoded.
     * @returns {Promise<Array<number>}
     */
    async serialize() {
        return await this._bdk.serializeTransaction(this.id);
    }
}
//# sourceMappingURL=Transaction.js.map