import { TransactionDetails } from './Bindings';
import { NativeLoader } from './NativeLoader';

/**
 * PartiallySignedTransaction methods
 */
export class PartiallySignedTransaction extends NativeLoader {
  base64: string;
  signedBase64: string = '';
  txid: string;
  extractTx: any;
  feeAmount: number;
  transactionDetails: TransactionDetails;
  constructor(base64: string, txid: string, extractTx: any, feeAmount: number, transactionDetails: TransactionDetails) {
    super();
    this.base64 = base64;
    this.txid = txid;
    this.extractTx = extractTx;
    this.feeAmount = feeAmount;
    this.transactionDetails = transactionDetails;
  }

  setSignedPsbt(sbt: string): PartiallySignedTransaction {
    this.signedBase64 = sbt;
    return this;
  }
}
