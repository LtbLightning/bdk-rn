import { NativeLoader } from './NativeLoader';
import { Transaction } from './Transaction';
/**
 * A Partially Signed Transaction
 */
export class PartiallySignedTransaction extends NativeLoader {
    constructor(base64) {
        super();
        this.base64 = base64;
    }
    /**
     * Combines this [PartiallySignedTransaction] with other PSBT as described by BIP 174.
     * In accordance with BIP 174 this function is commutative i.e., `A.combine(B) == B.combine(A)`
     *
     * @returns {Promise<PartiallySignedTransaction>}
     */
    async combine(other) {
        const base64 = await this._bdk.combine(this.base64, other.base64);
        return new PartiallySignedTransaction(base64);
    }
    /**
     * Extract the final transaction from the PSBT.
     * @returns {Promise<Transaction>}
     */
    async extractTx() {
        const id = await this._bdk.extractTx(this.base64);
        return new Transaction(id);
    }
    /**
     * Serialize the PSBT to hex format.
     * @returns {Promise<string>}
     */
    async serialize() {
        return await this._bdk.serialize(this.base64);
    }
    /**
     * Get the transaction ID (txid) of the PSBT.
     * @returns {Promise<string>}
     */
    async txid() {
        return await this._bdk.txid(this.base64);
    }
}
//# sourceMappingURL=PartiallySignedTransaction.js.map