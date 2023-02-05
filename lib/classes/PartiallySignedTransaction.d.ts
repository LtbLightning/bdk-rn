import { TransactionDetails } from './Bindings';
import { NativeLoader } from './NativeLoader';
/**
 * PartiallySignedTransaction methods
 */
export declare class PartiallySignedTransaction extends NativeLoader {
    private base64;
    private txid;
    private extractTx;
    private feeAmount;
    private transactionDetails;
    constructor(base64: string, txid: string, extractTx: any, feeAmount: number, transactionDetails: TransactionDetails);
}
