import { NativeLoader } from './NativeLoader';
import { createTxOut } from '../lib/utils';
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
     * @returns {Promise<Array<number>>}
     */
    async serialize() {
        return await this._bdk.serializeTransaction(this.id);
    }
    async txid() {
        return await this._bdk.transactionTxid(this.id);
    }
    async weight() {
        return await this._bdk.txWeight(this.id);
    }
    async size() {
        return await this._bdk.txSize(this.id);
    }
    async vsize() {
        return await this._bdk.txVsize(this.id);
    }
    async isCoinBase() {
        return await this._bdk.txIsCoinBase(this.id);
    }
    async isExplicitlyRbf() {
        return await this._bdk.txIsExplicitlyRbf(this.id);
    }
    async isLockTimeEnabled() {
        return await this._bdk.txIsLockTimeEnabled(this.id);
    }
    async version() {
        return await this._bdk.txVersion(this.id);
    }
    async lockTime() {
        return await this._bdk.txLockTime(this.id);
    }
    async input() {
        return await this._bdk.txInput(this.id);
    }
    async output() {
        let output = await this._bdk.txOutput(this.id);
        let localTxout = [];
        output.map((item) => localTxout.push(createTxOut(item)));
        return localTxout;
    }
}
//# sourceMappingURL=Transaction.js.map