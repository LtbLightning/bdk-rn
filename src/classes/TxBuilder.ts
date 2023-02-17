import { Wallet } from './Wallet';
import { OutPoint, Script } from './Bindings';
import { NativeLoader } from './NativeLoader';
import { createTxDetailsObject } from '../lib/utils';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';

/**
 * TxBuilder methods
 */
export class TxBuilder extends NativeLoader {
  id: string = '';

  /**
   * Create TxBuilder at native side
   * @returns {Promise<TxBuilder>}
   */
  async create(): Promise<TxBuilder> {
    this.id = await this._bdk.createTxBuilder();
    return this;
  }

  /**
   * Add recipient
   * @param script
   * @param amount
   * @returns {Promise<TxBuilder>}
   */
  async addRecipient(script: Script, amount: number): Promise<TxBuilder> {
    await this._bdk.addRecipient(this.id, script.id, amount);
    return this;
  }

  /**
   * Finishes the transaction building
   * @param wallet
   * @returns
   */
  async finish(wallet: Wallet): Promise<PartiallySignedTransaction> {
    let psbt = await this._bdk.finish(this.id, wallet.id);
    const txObject = createTxDetailsObject(psbt.transactionDetails);
    let signedPsbt = new PartiallySignedTransaction(
      psbt.id,
      psbt.base64,
      psbt.txid,
      psbt.extractTx,
      psbt.feeAmount,
      txObject
    );
    return signedPsbt;
  }

  /**
   * Add unspendable
   * @param outPoint
   * @returns {Promise<TxBuilder>}
   */
  async addUnspendable(outPoint: OutPoint): Promise<TxBuilder> {
    await this._bdk.addUnspendable(this.id, outPoint);
    return this;
  }

  /**
   * Add Utxo
   * @param outPoint
   * @returns {Promise<TxBuilder>}
   */
  async addUtxo(outPoint: OutPoint): Promise<TxBuilder> {
    await this._bdk.addUtxo(this.id, outPoint);
    return this;
  }

  /**
   * Add Utxos
   * @param {Array<outPoint>}
   * @returns {Promise<TxBuilder>}
   */
  async addUtxos(outPoints: Array<OutPoint>): Promise<TxBuilder> {
    await this._bdk.addUtxos(this.id, outPoints);
    return this;
  }

  /**
   * Do not spend change outputs
   * @returns {Promise<TxBuilder>}
   */
  async doNotSpendChange(): Promise<TxBuilder> {
    await this._bdk.doNotSpendChange(this.id);
    return this;
  }

  /**
   * Only spend utxos added by add_utxo
   * @returns {Promise<TxBuilder>}
   */
  async manuallySelectedOnly(): Promise<TxBuilder> {
    await this._bdk.manuallySelectedOnly(this.id);
    return this;
  }

  /**
   * Only spend change outputs
   * @returns {Promise<TxBuilder>}
   */
  async onlySpendChange(): Promise<TxBuilder> {
    await this._bdk.onlySpendChange(this.id);
    return this;
  }

  /**
   * Add unspendable utxos list
   * @param {Array<outPoint>}
   * @returns {Promise<TxBuilder>}
   */
  async unspendable(outPoints: Array<OutPoint>): Promise<TxBuilder> {
    await this._bdk.unspendable(this.id, outPoints);
    return this;
  }
}
