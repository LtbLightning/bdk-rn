import { TransactionDetails } from './Bindings';
import { NativeLoader } from './NativeLoader';
/**
 * PartiallySignedTransaction methods
 */
export declare class PartiallySignedTransaction extends NativeLoader {
    base64: string;
    signedBase64: string;
    txid: string;
    extractTx: any;
    feeAmount: number;
    transactionDetails: TransactionDetails;
    constructor(base64: string, txid: string, extractTx: any, feeAmount: number, transactionDetails: TransactionDetails);
    setSignedPsbt(sbt: string): PartiallySignedTransaction;
}
