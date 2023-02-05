import { NativeLoader } from './NativeLoader';
/**
 * PartiallySignedTransaction methods
 */
export class PartiallySignedTransaction extends NativeLoader {
    constructor(base64, txid, extractTx, feeAmount, transactionDetails) {
        super();
        this.base64 = base64;
        this.txid = txid;
        this.extractTx = extractTx;
        this.feeAmount = feeAmount;
        this.transactionDetails = transactionDetails;
    }
}
//# sourceMappingURL=PartiallySignedTransaction.js.map