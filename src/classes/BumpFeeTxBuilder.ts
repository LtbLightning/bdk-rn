import { NativeLoader } from './NativeLoader';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
import { Wallet } from './Wallet';
import { FeeRate } from './Bindings';

/**
 * BumpFeeTxBuilder methods
 * The BumpFeeTxBuilder is used to bump the fee on a transaction that has been broadcast and has its RBF flag set to true.
 */
export class BumpFeeTxBuilder extends NativeLoader {
  id: string = '';

  /**
   * Create a new BumpFeeTxBuilder
   * @param txid The transaction ID of the transaction to bump
   * @param newFeeRate The new fee rate to use
   * @returns {Promise<BumpFeeTxBuilder>}
   */
  async create(txid: string, newFeeRate: FeeRate): Promise<BumpFeeTxBuilder> {
    this.id = await this._bdk.bumpFeeTxBuilderInit(txid, await newFeeRate.getSatPerVb());
    return this;
  }

  /**
   * Enable signaling RBF
   * This will use the default nSequence value of `0xFFFFFFFD`
   *
   * @returns {Promise<BumpFeeTxBuilder>}
   */
  async enableRbf(): Promise<BumpFeeTxBuilder> {
    await this._bdk.bumpFeeTxBuilderEnableRbf(this.id);
    return this;
  }

  /**
   * Enable signaling RBF with a specific nSequence value
   *
   * This can cause conflicts if the wallet's descriptors contain an "older" (OP_CSV) operator and the given nsequence is lower than the CSV value.
   *
   * If the nsequence is higher than `0xFFFFFFFD` an error will be thrown, since it would not be a valid nSequence to signal RBF.
   * @param nSequence
   * @returns {Promise<BumpFeeTxBuilder>}
   */
  async enableRbfWithSequence(nSequence: number): Promise<BumpFeeTxBuilder> {
    await this._bdk.bumpFeeTxBuilderEnableRbfWithSequence(this.id, nSequence);
    return this;
  }

  /**
   * Finish building the transaction.
   * @param wallet
   * @returns {Promise<PartiallySignedTransaction>}
   */
  async finish(wallet: Wallet): Promise<PartiallySignedTransaction> {
    const psbtBase64 = await this._bdk.bumpFeeTxBuilderFinish(this.id, wallet.id);
    return new PartiallySignedTransaction(psbtBase64);
  }
}