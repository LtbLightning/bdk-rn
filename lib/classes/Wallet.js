import { AddressInfo, Balance, BlockTime, LocalUtxo, OutPoint, TransactionDetails, TxOut } from './Bindings';
import { AddressIndex } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Wallet methods
 */
class WalletInterface extends NativeLoader {
    constructor() {
        super(...arguments);
        this.isInit = false;
    }
    /**
     * Wallet constructor
     * @param descriptor
     * @param network
     * @returns {Promise<WalletInterface>}
     */
    async init(descriptor, network) {
        let created = await this._bdk.initWallet(descriptor, network);
        if (created)
            this.isInit = created;
        return this;
    }
    /**
     * Return a derived address using the external descriptor.
     * @param addressIndex
     * @returns {Promise<AddressInfo>}
     */
    async getAddress(addressIndex = AddressIndex.New) {
        let addressInfo = await this._bdk.getAddress(addressIndex);
        return new AddressInfo(addressInfo.index, addressInfo.address);
    }
    /**
     * Return balance of current wallet
     * @returns {Promise<Balance>}
     */
    async getBalance() {
        let balance = await this._bdk.getBalance();
        return new Balance(balance.trustedPending, balance.untrustedPending, balance.confirmed, balance.spendable, balance.total);
    }
    /**
     * Get the Bitcoin network the wallet is using.
     * @returns {Promise<string>}
     */
    async network() {
        return await this._bdk.getNetwork();
    }
    /**
     * Sync the internal database with the [Blockchain]
     * @returns {Promise<boolean>}
     */
    async sync() {
        return await this._bdk.sync();
    }
    /**
     * Return the list of unspent outputs of this wallet
     * @returns {Promise<Array<LocalUtxo>>}
     */
    async listUnspent() {
        let output = await this._bdk.listUnspent();
        let localUtxo = [];
        output.map((item) => {
            let localObj = new LocalUtxo(new OutPoint(item.outpoint.txid, item.outpoint.vout), new TxOut(item.txout.value, item.txout.address), item.isSpent);
            localUtxo.push(localObj);
        });
        return localUtxo;
    }
    /**
     * Return an unsorted list of transactions made and received by the wallet
     * @returns {Promise<Array<TransactionDetails>>}
     */
    async listTransactions() {
        let list = await this._bdk.listTransactions();
        let transactions = [];
        list.map((item) => {
            var _a, _b;
            let localObj = new TransactionDetails(item.txid, item.received, item.sent, item === null || item === void 0 ? void 0 : item.fee, new BlockTime((_a = item.confirmationTime) === null || _a === void 0 ? void 0 : _a.height, (_b = item.confirmationTime) === null || _b === void 0 ? void 0 : _b.timestamp));
            transactions.push(localObj);
        });
        return transactions;
    }
}
export const Wallet = new WalletInterface();
//# sourceMappingURL=Wallet.js.map