import { createOutpoint, createTxDetailsObject, createTxOut, getNetwork } from '../lib/utils';
import { AddressInfo, Balance, LocalUtxo } from './Bindings';
import { NativeLoader } from './NativeLoader';
import { PartiallySignedTransaction } from './PartiallySignedTransaction';
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
     * Return a derived address using the external descriptor.
     * @param addressIndex
     * @returns {Promise<AddressInfo>}
     */
    async getAddress(addressIndex) {
        let addressInfo = await this._bdk.getAddress(this.id, addressIndex);
        return new AddressInfo(addressInfo.index, addressInfo.address);
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
}
//# sourceMappingURL=Wallet.js.map