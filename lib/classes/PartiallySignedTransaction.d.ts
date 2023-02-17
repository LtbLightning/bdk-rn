import { TransactionDetails } from './Bindings';
import { NativeLoader } from './NativeLoader';
/**
 * PartiallySignedTransaction methods
 */
export declare class PartiallySignedTransaction extends NativeLoader {
    id: string;
    base64: string;
    txid: string;
    extractTx: any;
    feeAmount: number;
    transactionDetails: TransactionDetails;
    constructor(id: string, base64: string, txid: string, extractTx: any, feeAmount: number, transactionDetails: TransactionDetails);
}
