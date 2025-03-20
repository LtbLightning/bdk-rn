import { TxIn, TxOut } from '../classes/Bindings';
import { createTxIn, createTxOut } from '../lib/utils';
import { NativeLoader } from './NativeLoader';

/**
 * Transaction methods
 */
export class Transaction extends NativeLoader {
  id: string = '';

  constructor(id: string = '') {
    super();
    this.id = id;
  }

  /**
   * Create Transaction at native side
   * @param {Array<number>} bytes - Transaction bytes
   * @returns {Promise<Transaction>}
   */
  static async create(bytes: Array<number>): Promise<Transaction> {
    const instance = new Transaction();
    const id = await instance._bdk.createTransaction(bytes);
    instance.id = id;
    return instance;
  }

  /**
   * Return the transaction bytes, bitcoin consensus encoded.
   * @returns {Promise<Array<number>>}
   */
  async serialize(): Promise<Array<number>> {
    return await this._bdk.serializeTransaction(this.id);
  }

  async txid(): Promise<string> {
    return await this._bdk.transactionTxid(this.id);
  }

  async weight(): Promise<number> {
    return await this._bdk.txWeight(this.id);
  }

  async size(): Promise<number> {
    return await this._bdk.txSize(this.id);
  }

  async vsize(): Promise<number> {
    return await this._bdk.txVsize(this.id);
  }

  async isCoinBase(): Promise<boolean> {
    return await this._bdk.txIsCoinBase(this.id);
  }

  async isExplicitlyRbf(): Promise<boolean> {
    return await this._bdk.txIsExplicitlyRbf(this.id);
  }

  async isLockTimeEnabled(): Promise<boolean> {
    return await this._bdk.txIsLockTimeEnabled(this.id);
  }

  async version(): Promise<number> {
    return await this._bdk.txVersion(this.id);
  }

  async lockTime(): Promise<number> {
    return await this._bdk.txLockTime(this.id);
  }

  async input(): Promise<Array<TxIn>> {
    const input = await this._bdk.txInput(this.id);
    return input.map((item: any) => createTxIn(item));
  }

  async output(): Promise<Array<TxOut>> {
    const output = await this._bdk.txOutput(this.id);
    return output.map((item: any) => createTxOut(item));
  }

  /**
   * Static method to create a Transaction from extracted data
   * @param {string} id - Transaction ID
   * @returns {Transaction}
   */
  static fromData(id: string): Transaction {
    return new Transaction(id);
  }
}