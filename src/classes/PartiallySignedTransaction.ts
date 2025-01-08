import { NativeLoader } from './NativeLoader';
import { Transaction } from './Transaction';

/**
 * A Partially Signed Transaction
 */
export class PartiallySignedTransaction extends NativeLoader {
  base64: string;

  constructor(base64: string) {
    super();
    this.base64 = base64;
  }

  /**
   * Combines this [PartiallySignedTransaction] with other PSBT as described by BIP 174.
   * In accordance with BIP 174 this function is commutative i.e., `A.combine(B) == B.combine(A)`
   *
   * @returns {Promise<PartiallySignedTransaction>}
   */
  async combine(other: PartiallySignedTransaction): Promise<PartiallySignedTransaction> {
    const base64 = await this._bdk.combine(this.base64, other.base64);
    return new PartiallySignedTransaction(base64);
  }

  /**
   * Extract the final transaction from the PSBT.
   * @returns {Promise<Transaction>}
   */
  async extractTx(): Promise<Transaction> {
    const id = await this._bdk.extractTx(this.base64);
    return new Transaction(id);
  }

  /**
   * Serialize the PSBT to hex format.
   * @returns {Promise<string>}
   */
  async serialize(): Promise<string> {
    return await this._bdk.serialize(this.base64);
  }

  /**
   * Get the transaction ID (txid) of the PSBT.
   * @returns {Promise<string>}
   */
  async txid(): Promise<string> {
    return await this._bdk.txid(this.base64);
  }

  // The following methods are not present in the Swift code provided,
  // so I'm commenting them out. If they are implemented elsewhere in the native code,
  // you can uncomment and keep them.

  /*
  /**
   * Return feeAmount
   * @returns {Promise<number>}
   */
  /*
  async feeAmount(): Promise<number> {
    return await this._bdk.feeAmount(this.base64);
  }
  */

  /*
  /**
   * Return feeRate
   * @returns {Promise<number>}
   */
  /*
  async feeRate(): Promise<number> {
    return await this._bdk.psbtFeeRate(this.base64);
  }
  */

  /*
  /**
   * Return transaction as json
   * @returns {Promise<string>}
   */
  /*
  async jsonSerialize(): Promise<string> {
    return await this._bdk.jsonSerialize(this.base64);
  }
  */
}