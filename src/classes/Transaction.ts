import { TxIn, TxOut } from '../classes/Bindings';
import { createTxIn, createTxOut } from '../lib/utils';
import { NativeLoader } from './NativeLoader';

/**
 * Transaction methods
 */
export class Transaction extends NativeLoader {
  id: string = '';

  /**
   * Set Transaction from extractTx
   * @returns {Transaction}
   */
  _setTransaction(id: string): Transaction {
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

  async input(): Promise<Array<any>> {
    let input = await this._bdk.txInput(this.id);
    let localTxIn: Array<TxIn> = [];
    input.map((item) => localTxIn.push(createTxIn(item)));
    return localTxIn;
  }

  async output(): Promise<Array<TxOut>> {
    let output = await this._bdk.txOutput(this.id);
    let localTxout: Array<TxOut> = [];
    output.map((item) => localTxout.push(createTxOut(item)));
    return localTxout;
  }
}
