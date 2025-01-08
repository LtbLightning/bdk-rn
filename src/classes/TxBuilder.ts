import { NativeLoader } from './NativeLoader';
import { Script } from './Script';
import { OutPoint } from './Bindings';
import { Amount } from './Amount';
import { Wallet } from './Wallet';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
import { FeeRate } from './FeeRate';

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
  async addRecipient(script: Script, amount: Amount): Promise<TxBuilder> {
    await this._bdk.addRecipient(this.id, script.id, await amount.toSats());
    return this;
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
   * @param {Array<OutPoint>}
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
   * @param {Array<OutPoint>}
   * @returns {Promise<TxBuilder>}
   */
  async unspendable(outPoints: Array<OutPoint>): Promise<TxBuilder> {
    await this._bdk.unspendable(this.id, outPoints);
    return this;
  }

  // Note: The following methods are not present in the provided Swift code,
  // but I'm keeping them here in case they're implemented elsewhere or planned for future use.

  /**
   * Set a custom fee rate
   * @param {FeeRate}
   * @returns {Promise<TxBuilder>}
   */
  async feeRate(feeRate: FeeRate): Promise<TxBuilder> {
    await this._bdk.feeRate(this.id, await feeRate.getSatPerVb());
    return this;
  }

  /**
   * Set an absolute fee
   * @param {Amount}
   * @returns {Promise<TxBuilder>}
   */
  async feeAbsolute(fee: Amount): Promise<TxBuilder> {
    await this._bdk.feeAbsolute(this.id, await fee.toSats());
    return this;
  }

  /**
   * Spend all the available inputs. This respects filters like TxBuilder().unSpendable and the change policy.
   * @returns {Promise<TxBuilder>}
   */
  async drainWallet(): Promise<TxBuilder> {
    await this._bdk.drainWallet(this.id);
    return this;
  }

  /**
   * Sets the address script to drain excess coins to.
   * @returns {Promise<TxBuilder>}
   */
  async drainTo(script: Script): Promise<TxBuilder> {
    await this._bdk.drainTo(this.id, script.id);
    return this;
  }

  /**
   * Enable signaling RBF
   * @returns {Promise<TxBuilder>}
   */
  async enableRbf(): Promise<TxBuilder> {
    await this._bdk.enableRbf(this.id);
    return this;
  }

  /**
   * Enable signaling RBF with a specific nSequence value
   * @param {number}
   * @returns {Promise<TxBuilder>}
   */
  async enableRbfWithSequence(nsequence: number): Promise<TxBuilder> {
    await this._bdk.enableRbfWithSequence(this.id, nsequence);
    return this;
  }

  /**
   * Add data as an output, using OP_RETURN
   * @param {Array<number>}
   * @returns {Promise<TxBuilder>}
   */
  async addData(data: Array<number>): Promise<TxBuilder> {
    await this._bdk.addData(this.id, data);
    return this;
  }

  /**
   * Add number of recipients at once
   * @param {Array<{script: Script; amount: Amount}>}
   * @returns {Promise<TxBuilder>}
   */
  async setRecipients(recipients: Array<{ script: Script; amount: Amount }>): Promise<TxBuilder> {
    const scriptAmounts = await Promise.all(
      recipients.map(async ({ script, amount }) => ({
        script: script.id,
        amount: await amount.toSats(),
      }))
    );
    const scriptAmountsWithScript = scriptAmounts.map(({ script, amount }) => ({
      script: new Script(script),
      amount,
    }));
    await this._bdk.setRecipients(this.id, scriptAmountsWithScript);
    return this;
  }

  /**
   * Finishes the transaction building
   * @param wallet
   * @returns {Promise<PartiallySignedTransaction>}
   */
  async finish(wallet: Wallet): Promise<PartiallySignedTransaction> {
    const psbtBase64 = await this._bdk.finish(this.id, wallet.id);
    return new PartiallySignedTransaction(psbtBase64.base64);
  }
}