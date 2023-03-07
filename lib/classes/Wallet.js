import { AddressInfo, Balance, LocalUtxo, OutPoint, TxOut } from './Bindings';
import { AddressIndex } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
import { createTxDetailsObject } from '../lib/utils';
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
    async create(descriptor, network) {
        this.id = await this._bdk.walletInit(descriptor, network);
        this.isInit = true;
        return this;
    }
    /**
     * Return a derived address using the external descriptor.
     * @param addressIndex
     * @returns {Promise<AddressInfo>}
     */
    async getAddress(addressIndex = AddressIndex.New) {
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
        return await this._bdk.getNetwork(this.id);
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
        let list = await this._bdk.listTransactions(this.id);
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
    async sign(psbt) {
        let signed = await this._bdk.sign(this.id, psbt.base64);
        psbt.setSignedPsbt(signed);
        return psbt;
    }
}
//# sourceMappingURL=Wallet.js.map