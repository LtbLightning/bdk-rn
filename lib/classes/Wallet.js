import { AddressInfo, Balance, BlockTime, FeeRate, FullScanRequest, LocalUtxo, SyncRequest, TransactionDetails } from './Bindings';
import { createOutpoint, createTxDetailsObject, createTxOut, getKeychainKind, getNetwork } from '../lib/utils';
import { NativeLoader } from './NativeLoader';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
import { Transaction } from './Transaction';
/**
 * Wallet methods
 */
export class Wallet extends NativeLoader {
    constructor() {
        super(...arguments);
        this.isInit = false;
        this.id = '';
    }
    /**
     * Wallet constructor
     * @param descriptor
     * @param network
     * @returns {Promise<Wallet>}
     */
    async create(descriptor, changeDescriptor = null, network, dbConfig) {
        this.id = await this._bdk.walletInit(descriptor.id, changeDescriptor ? changeDescriptor.id : null, network, dbConfig.id);
        this.isInit = true;
        return this;
    }
    /**
     * Reveal the next address for a specific keychain
     * @param keychain The keychain to reveal the next address for
     * @returns {Promise<AddressInfo>} Information about the revealed address
     */
    async revealNextAddress(keychain) {
        const addressInfo = await this._bdk.walletRevealNextAddress(this.id, keychain);
        return new AddressInfo(addressInfo.address, getKeychainKind(addressInfo.keychain));
    }
    /**
     * check if the wallet is yours or not
     * @param script
     * @returns {Promise<boolean>}
     */
    async isMine(script) {
        return await this._bdk.isMine(this.id, script.id);
    }
    /**
     * Return balance of current wallet
     * @returns {Promise<Balance>}
     */
    async getBalance() {
        let balance = await this._bdk.getBalance(this.id);
        return new Balance(balance.trustedPending, balance.untrustedPending, balance.confirmed, balance.spendable, balance.total);
    }
    /**
     * Get the Bitcoin network the wallet is using.
     * @returns {Promise<string>}
     */
    async network() {
        let networkName = await this._bdk.getNetwork(this.id);
        return getNetwork(networkName);
    }
    /**
     * Sync the internal database with the [Blockchain]
     * @returns {Promise<boolean>}
     */
    async sync(blockchain) {
        return await this._bdk.sync(this.id, blockchain.id);
    }
    /**
     * Return the list of unspent outputs of this wallet
     * @returns {Promise<Array<LocalUtxo>>}
     */
    async listUnspent() {
        let output = await this._bdk.listUnspent(this.id);
        let localUtxo = [];
        output.map((item) => {
            let localObj = new LocalUtxo(createOutpoint(item.outpoint), createTxOut(item.txout), item.isSpent, item.keychain);
            localUtxo.push(localObj);
        });
        return localUtxo;
    }
    /**
     * Return an unsorted list of transactions made and received by the wallet
     * @returns {Promise<Array<TransactionDetails>>}
     */
    async listTransactions(includeRaw) {
        let list = await this._bdk.listTransactions(this.id, includeRaw);
        let transactions = [];
        list.map((item) => {
            let localObj = createTxDetailsObject(item);
            transactions.push(localObj);
        });
        return transactions;
    }
    /**
     * Sign PSBT with wallet
     * @returns
     */
    async sign(psbt, signOptions) {
        let signed = await this._bdk.sign(this.id, psbt.base64, signOptions);
        return new PartiallySignedTransaction(signed);
    }
    /**
   * Sync the wallet using a specific sync request
   * @param syncRequest The sync request to use
   * @param blockchain The blockchain to sync with
   * @param batchSize The number of transactions to process in each batch
   * @param fetchPrevTxouts Whether to fetch previous transaction outputs
   * @returns {Promise<void>}
   */
    async walletSync(syncRequest, blockchain, batchSize, fetchPrevTxouts) {
        await this._bdk.walletSync(this.id, syncRequest.id, blockchain.id, batchSize, fetchPrevTxouts);
    }
    /**
     * Start a sync process with revealed spending keys
     * @returns {Promise<SyncRequest>} A new sync request
     */
    async startSyncWithRevealedSpks() {
        const syncRequestId = await this._bdk.walletStartSyncWithRevealedSpks(this.id);
        return new SyncRequest(syncRequestId);
    }
    /**
     * Apply an update to the wallet
     * @param update The update to apply
     * @returns {Promise<void>}
     */
    async applyUpdate(update) {
        await this._bdk.walletApplyUpdate(this.id, update.id);
    }
    /**
     * Calculate the fee for a transaction
     * @param tx The transaction to calculate the fee for
     * @returns {Promise<number>} The calculated fee
     */
    async calculateFee(tx) {
        return await this._bdk.walletCalculateFee(this.id, tx.id);
    }
    /**
     * Calculate the fee rate for a transaction
     * @param tx The transaction to calculate the fee rate for
     * @returns {Promise<FeeRate>} The calculated fee rate
     */
    async calculateFeeRate(tx) {
        const feeRateId = await this._bdk.walletCalculateFeeRate(this.id, tx.id);
        return new FeeRate(parseFloat(feeRateId));
    }
    /**
     * Commit pending wallet operations
     * @returns {Promise<boolean>} True if commit was successful, false otherwise
     */
    async commit() {
        return await this._bdk.walletCommit(this.id);
    }
    /**
     * Get details of a specific transaction
     * @param txid The transaction ID to look up
     * @returns {Promise<TransactionDetails | null>} The transaction details, or null if not found
     */
    async getTx(txid) {
        const result = await this._bdk.walletGetTx(this.id, txid);
        if (result) {
            let confirmationTime = undefined;
            if (result.confirmationTime) {
                confirmationTime = new BlockTime(result.confirmationTime.height, result.confirmationTime.timestamp);
            }
            let transaction = null;
            if (result.transaction) {
                transaction = Transaction.fromData(result.transaction);
            }
            return new TransactionDetails(result.txid, result.received, result.sent, result.fee, confirmationTime, transaction);
        }
        return null;
    }
    /**
     * Get the list of all outputs (spent and unspent) associated with the wallet
     * @returns {Promise<LocalUtxo[]>} List of all outputs
     */
    async listOutput() {
        const outputs = await this._bdk.walletListOutput(this.id);
        return outputs.map(output => new LocalUtxo(output.outpoint, output.txout, output.isSpent, output.keychain));
    }
    /**
     * Reveal the next address for a specific keychain
     * @param keychain The keychain to reveal the next address for
     * @returns {Promise<AddressInfo>} Information about the revealed address
     */
    async walletRevealNextAddress(keychain) {
        const result = await this._bdk.walletRevealNextAddress(this.id, keychain);
        return new AddressInfo(result.address, result.keychain);
    }
    /**
     * Calculate the amount sent and received in a transaction
     * @param tx The transaction to analyze
     * @returns {Promise<{ sent: number; received: number }>} The amounts sent and received
     */
    async sentAndReceived(tx) {
        return await this._bdk.walletSentAndReceived(this.id, tx.id);
    }
    /**
     * Start a full scan of the wallet
     * @returns {Promise<FullScanRequest>} A new full scan request
     */
    async startFullScan() {
        const fullScanRequestId = await this._bdk.walletStartFullScan(this.id);
        return new FullScanRequest(fullScanRequestId);
    }
}
//# sourceMappingURL=Wallet.js.map