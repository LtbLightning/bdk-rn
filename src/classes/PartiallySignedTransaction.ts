import { TransactionDetails } from './Bindings';
import { NativeLoader } from './NativeLoader';

/**
 * PartiallySignedTransaction methods
 */
export class PartiallySignedTransaction extends NativeLoader {
  id: string;
  base64: string;
  txid: string;
  extractTx: any;
  feeAmount: number;
  transactionDetails: TransactionDetails;
  constructor(id: string, base64: string, txid: string, extractTx: any, feeAmount: number, transactionDetails: TransactionDetails) {
    super();
    this.id = id;
    this.base64 = base64;
    this.txid = txid;
    this.extractTx = extractTx;
    this.feeAmount = feeAmount;
    this.transactionDetails = transactionDetails;
  }
}
