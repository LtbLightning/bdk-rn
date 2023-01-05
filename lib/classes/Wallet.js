import { AddressInfo, Balance } from './Bindings';
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
    async init(descriptor, network) {
        let created = await this._bdk.initWallet(descriptor, network);
        if (created)
            this.isInit = created;
        return this;
    }
    async getAddress(addressIndex = AddressIndex.New) {
        let addressInfo = await this._bdk.getAddress(addressIndex);
        return new AddressInfo(addressInfo.index, addressInfo.address);
    }
    async getBalance() {
        let balance = await this._bdk.getBalance();
        return new Balance(balance.trustedPending, balance.untrustedPending, balance.confirmed, balance.spendable, balance.total);
    }
    async network() {
        return await this._bdk.getNetwork();
    }
    async sync() {
        return await this._bdk.sync();
    }
    async listUnspent() {
        let output = await this._bdk.listUnspent();
        console.log(output);
        return true;
    }
    async listTransactions() {
        let tsx = await this._bdk.listTransactions();
        console.log(tsx);
        return true;
    }
}
export const Wallet = new WalletInterface();
//# sourceMappingURL=Wallet.js.map