import { NativeLoader } from './NativeLoader';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
/**
 * BumpFeeTxBuilder methods
 * The BumpFeeTxBuilder is used to bump the fee on a transaction that has been broadcast and has its RBF flag set to true.
 */
export class BumpFeeTxBuilder extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
    }
    async create(txid, newFeeRate) {
        this.id = await this._bdk.bumpFeeTxBuilderInit(txid, newFeeRate);
        return this;
    }
    /**
     * Explicitly tells the wallet that it is allowed to reduce the amount of the output matching this `address` in order to bump the transaction fee. Without specifying this the wallet will attempt to find a change output to shrink instead.
     *
     * Note that the output may shrink to below the dust limit and therefore be removed. If it is preserved then it is currently not guaranteed to be in the same position as it was originally.
     *
     * Throws and exception if address can’t be found among the recipients of the transaction we are bumping.
     *
     * @param address
     * @returns {Promise<BumpFeeTxBuilder>}
     */
    async allowShrinking(script) {
        await this._bdk.bumpFeeTxBuilderAllowShrinking(this.id, script.id);
        return this;
    }
    /**
     * Enable signaling RBF
     * This will use the default nSequence value of `0xFFFFFFFD`
     *
     * @returns {Promise<BumpFeeTxBuilder>}
     */
    async enableRbf() {
        await this._bdk.bumpFeeTxBuilderEnableRbf(this.id);
        return this;
    }
    /**
     * Enable signaling RBF with a specific nSequence value
     *
     * This can cause conflicts if the wallet’s descriptors contain an “older” (OP_CSV) operator and the given nsequence is lower than the CSV value.
     *
     * If the nsequence is higher than `0xFFFFFFFD` an error will be thrown, since it would not be a valid nSequence to signal RBF.
     * @param nSequence
     * @returns {Promise<BumpFeeTxBuilder>}
     */
    async enableRbfWithSequence(nSequence) {
        await this._bdk.bumpFeeTxBuilderEnableRbfWithSequence(this.id, nSequence);
        return this;
    }
    /**
     * Finish building the transaction.
     * @param wallet
     * @returns
     */
    async finish(wallet) {
        let response = await this._bdk.bumpFeeTxBuilderFinish(this.id, wallet.id);
        return new PartiallySignedTransaction(response);
    }
}
//# sourceMappingURL=BumpFeeTxBuilder.js.map