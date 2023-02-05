import { Wallet } from './Wallet';
import { Script } from './Bindings';
import { NativeLoader } from './NativeLoader';

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
  async finish(wallet: Wallet): Promise<any> {
    let psbt = await this._bdk.finish(this.id, wallet.id);
    console.log('At module level', psbt);
    return psbt;
  }
}
