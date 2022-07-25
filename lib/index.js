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
    async genSeed(args) {
        try {
            const { password } = args;
            const seed = await this._bdk.genSeed(password);
            return success(seed);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Create xprv from seed and password
     * @return {Promise<Response>}
     */
    async createXprv(args) {
        try {
            const { mnemonic, password } = args;
            const descriptor = await this._bdk.createXprv(mnemonic, password);
            return success(descriptor);
        }
        catch (e) {
            return failure(e);
        }
    }
    /**
     * Create descriptor based on different parameters
     * @return {Promise<Response>}
     */
    async createDescriptor(args) {
        try {
            const { type, useMnemonic, mnemonic, password, publicKeys, thresold } = args;
            let xprv = args.xprv;
            let path = args.path;
            if (useMnemonic) {
                if (!_exists(mnemonic))
                    throw 'Mnemonic seed is required';
                xprv = await (await this.createXprv({ mnemonic, password })).data;
            }
            if (!useMnemonic && !_exists(xprv))
                throw 'XPRV is required';
            if (!_exists(path))
                path = "/84'/1'/0'/0/*";
            let descriptor = '';
            if (type != 'multi') {
                let method = '';
                switch (type) {
                    case 'default':
                    case null:
                    case '':
                    case 'p2wpkh':
                    case 'wpkh':
                        method = 'wpkh';
                        break;
                    case 'p2pkh':
                    case 'pkh':
                        method = 'pkh';
                        break;
                    case 'shp2wpkh':
                    case 'p2shp2wpkh':
                        method = 'sh(wpkh';
                        break;
                }
                descriptor = `${method}(${xprv}${path})`;
            }
            else {
                if (!_exists(thresold) || !_exists(publicKeys) || (_exists(publicKeys) && (publicKeys === null || publicKeys === void 0 ? void 0 : publicKeys.length) == 0))
                    throw 'Thresold or publicKeys values are invalid.';
                if (thresold == 0 || thresold > (publicKeys === null || publicKeys === void 0 ? void 0 : publicKeys.length) + 1)
                    throw 'Thresold value in invalid.';
                descriptor = `sh(multi(${thresold}${xprv},${publicKeys === null || publicKeys === void 0 ? void 0 : publicKeys.join(',')}${path}`;
            }
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
    async createWallet(args) {
        try {
            const { mnemonic, descriptor, useDescriptor, password, network, blockChainConfigUrl, blockChainSocket5, retry, timeOut, blockChainName, } = args;
            if (useDescriptor && !_exists(descriptor))
                throw 'Required descriptor parameter is emtpy.';
            if (!useDescriptor && !_exists(mnemonic))
                throw 'Required mnemonic parameter is emtpy.';
            if (useDescriptor && (descriptor === null || descriptor === void 0 ? void 0 : descriptor.split(' ').length) > 1)
                throw 'Descriptor is not valid.';
            const wallet = await this._bdk.createWallet(mnemonic, password, network, blockChainConfigUrl, blockChainSocket5, retry, timeOut, blockChainName, useDescriptor ? descriptor : '');
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
    async broadcastTx(args) {
        try {
            const { address, amount } = args;
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
    async getPendingTransactions() {
        try {
            const response = await this._bdk.getPendingTransactions();
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