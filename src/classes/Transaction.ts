import { NativeLoader } from './NativeLoader';

/**
 * Transaction methods
 */
export class Transaction extends NativeLoader {
  id: string = '';

  /**
   * Set Transaction from extractTx
   * @returns {Promise<Transaction>}
   */
  async _setTransaction(id: string): Promise<Transaction> {
    this.id = id;
    return this;
  }

  /**
   * Create Transaction at native side
   * @returns {Promise<Transaction>}
   */
  async create(bytes: Array<number>): Promise<Transaction> {
    this.id = await this._bdk.createTransaction(bytes);
    return this;
  }

  /**
   * Return the transaction bytes, bitcoin consensus encoded.
   * @returns {Promise<Array<number>}
   */
  async serialize(): Promise<Array<number>> {
    return await this._bdk.serializeTransaction(this.id);
  }
}
