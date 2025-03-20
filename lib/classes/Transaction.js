import { createTxIn, createTxOut } from '../lib/utils';
import { NativeLoader } from './NativeLoader';
/**
 * Transaction methods
 */
export class Transaction extends NativeLoader {
    constructor(id = '') {
        super();
        this.id = '';
        this.id = id;
    }
    /**
     * Create Transaction at native side
     * @param {Array<number>} bytes - Transaction bytes
     * @returns {Promise<Transaction>}
     */
    static async create(bytes) {
        const instance = new Transaction();
        const id = await instance._bdk.createTransaction(bytes);
        instance.id = id;
        return instance;
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
        const input = await this._bdk.txInput(this.id);
        return input.map((item) => createTxIn(item));
    }
    async output() {
        const output = await this._bdk.txOutput(this.id);
        return output.map((item) => createTxOut(item));
    }
    /**
     * Static method to create a Transaction from extracted data
     * @param {string} id - Transaction ID
     * @returns {Transaction}
     */
    static fromData(id) {
        return new Transaction(id);
    }
}
//# sourceMappingURL=Transaction.js.map