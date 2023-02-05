import { TransactionDetails } from './Bindings';
import { NativeLoader } from './NativeLoader';

/**
 * PartiallySignedTransaction methods
 */
export class PartiallySignedTransaction extends NativeLoader {
  private base64: string;
  private txid: string;
  private extractTx: any;
  private feeAmount: number;
  private transactionDetails: TransactionDetails;
  constructor(base64: string, txid: string, extractTx: any, feeAmount: number, transactionDetails: TransactionDetails) {
    super();
    this.base64 = base64;
    this.txid = txid;
    this.extractTx = extractTx;
    this.feeAmount = feeAmount;
    this.transactionDetails = transactionDetails;
  }
}
