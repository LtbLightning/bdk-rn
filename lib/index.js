import { NativeModules } from 'react-native';
import { failure, success, _exists } from './lib/utils';
class BdkInterface {
    constructor() {
        this._bdk = NativeModules.BdkRnModule;
    }
    /**
     * Gen seed of 12 words
     * @return {Promise<Response>}
     */
    async genSeed(password = '') {
        try {
            const seed = await this._bdk.genSeed(password);
            return success(seed);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Gen descriptor from seed and password
     * @return {Promise<Response>}
     */
    async genDescriptor(mnemonic, password = '') {
        try {
            const descriptor = await this._bdk.genDescriptor(mnemonic, password);
            return success(descriptor);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Init wallet
     * @return {Promise<Response>}
     */
    async initWallet(mnemonic, password = '', network = '', blockChainConfigUrl = '', blockChainSocket5 = '', retry = '', timeOut = '', blockChain = '') {
        try {
            if (!_exists(mnemonic))
                throw 'Required mnemonic parameter is emtpy.';
            const wallet = await this._bdk.initWallet(mnemonic, password, network, blockChainConfigUrl, blockChainSocket5, retry, timeOut, blockChain);
            return success(wallet);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Get new address
     * @return {Promise<Response>}
     */
    async getNewAddress() {
        try {
            const address = await this._bdk.getNewAddress();
            return success(address);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Get wallet balance
     * @return {Promise<Response>}
     */
    async getBalance() {
        try {
            const balance = await this._bdk.getBalance();
            return success(balance);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Broadcast Transaction
     * @return {Promise<Response>}
     */
    async broadcastTx(address, amount) {
        try {
            if (!_exists(address) || !_exists(amount))
                throw 'Required address or amount parameters are missing.';
            if (isNaN(amount))
                throw 'Entered amount is invalid';
            const tx = await this._bdk.broadcastTx(address, amount);
            return success(tx);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Get pending transactions
     * @return {Promise<Response>}
     */
    async genPendingTransactions() {
        try {
            const response = await this._bdk.genPendingTransactions();
            return success(response);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Get pending transactions
     * @return {Promise<Response>}
     */
    async getConfirmedTransactions() {
        try {
            const response = await this._bdk.getConfirmedTransactions();
            return success(response);
        }
        catch (e) {
            return failure(e);
        }
    }
}
const BdkRn = new BdkInterface();
export default BdkRn;
//# sourceMappingURL=index.js.map