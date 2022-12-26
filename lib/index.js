import { err, ok } from '@synonymdev/result';
import { NativeModules } from 'react-native';
import { _exists } from './lib/utils';
class BdkInterface {
    constructor() {
        this._bdk = NativeModules.BdkRnModule;
    }
    /**
     * Generate mnemonic seed phrase of specified entropy and length
     * @return {Promise<Result<string>>}
     */
    async generateMnemonic(args = { length: 12 }) {
        try {
            const entropyToLength = {
                '128': 12,
                '160': 15,
                '192': 18,
                '224': 21,
                '256': 24,
            };
            let wordCount;
            if (args.entropy && args.length) {
                wordCount = entropyToLength[args.entropy];
            }
            else if (!args.entropy && !args.length) {
                wordCount = 12;
            }
            else {
                wordCount = args.length;
            }
            const seed = await this._bdk.generateMnemonic(wordCount);
            return ok(seed);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Generate extended key from network, seed and password
     * @return {Promise<Result<string>>}
     */
    async createExtendedKey(args) {
        try {
            const { network, mnemonic, password } = args;
            const keyInfo = await this._bdk.getExtendedKeyInfo(network, mnemonic, password);
            return ok(keyInfo);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Create xprv from network, seed and password
     * @return {Promise<Result<string>>}
     */
    async createXprv(args) {
        try {
            const { network, mnemonic, password } = args;
            const keyInfo = await this._bdk.getExtendedKeyInfo(network, mnemonic, password);
            return ok(keyInfo.xprv);
        }
        catch (e) {
            console.log(e);
            return err(e);
        }
    }
    /**
     * Create descriptor based on different parameters
     * @return {Promise<Result<string>>}
     */
    async createDescriptor(args) {
        try {
            const { type, mnemonic, password, network, publicKeys, threshold } = args;
            let xprv = args.xprv;
            let path = args.path;
            if (!_exists(xprv) && !_exists(mnemonic))
                throw 'Required param mnemonic or xprv is missing.';
            if (_exists(xprv) && _exists(mnemonic))
                throw 'Only one parameter is required either mnemonic or xprv.';
            const useMnemonic = !_exists(xprv);
            if (useMnemonic) {
                if (!_exists(mnemonic) || !_exists(network))
                    throw 'One or more required parameters are empty(Mnemonic, Network).';
                const createXprvRes = await this.createXprv({ network, mnemonic, password });
                if (createXprvRes.isOk())
                    xprv = createXprvRes.value;
            }
            if (!useMnemonic && !_exists(xprv))
                throw 'XPRV is required';
            if (!_exists(path))
                path = "/84'/1'/0'/0/*";
            let descriptor = '';
            if (type != 'MULTI') {
                let descriptorArgs = `${xprv}${path}`;
                switch (type) {
                    case 'default':
                    case null:
                    case undefined:
                    case '':
                    case 'p2wpkh':
                    case 'wpkh':
                        descriptor = `wpkh(${descriptorArgs})`;
                        break;
                    case 'p2pkh':
                    case 'pkh':
                        descriptor = `pkh(${descriptorArgs})`;
                        break;
                    case 'shp2wpkh':
                    case 'p2shp2wpkh':
                        descriptor = `sh(wpkh(${descriptorArgs}))`;
                        break;
                }
            }
            else {
                if (!threshold || !publicKeys || (publicKeys && (publicKeys === null || publicKeys === void 0 ? void 0 : publicKeys.length) == 0))
                    throw 'Threshold or publicKeys values are invalid.';
                if (threshold == 0 || threshold > (publicKeys === null || publicKeys === void 0 ? void 0 : publicKeys.length) + 1)
                    throw 'Threshold value is invalid.';
                descriptor = `sh(multi(${threshold}${xprv},${publicKeys === null || publicKeys === void 0 ? void 0 : publicKeys.join(',')}${path}))`;
            }
            return ok(descriptor);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Init wallet
     * @return {Promise<Result<createWalletResponse>>}
     */
    async createWallet(args) {
        try {
            const { mnemonic, descriptor, password, network, blockChainConfigUrl, blockChainSocket5, retry, timeOut, blockChainName, } = args;
            if (!_exists(descriptor) && !_exists(mnemonic))
                throw 'Required param mnemonic or descriptor is missing.';
            if (_exists(descriptor) && _exists(mnemonic))
                throw 'Only one parameter is required either mnemonic or descriptor.';
            const useDescriptor = _exists(descriptor);
            if (useDescriptor && (descriptor === null || descriptor === void 0 ? void 0 : descriptor.includes(' ')))
                throw 'Descriptor is not valid.';
            if (!useDescriptor && (!_exists(mnemonic) || !_exists(network)))
                throw 'One or more required parameters are empty(Mnemonic, Network).';
            const wallet = await this._bdk.createWallet(mnemonic !== null && mnemonic !== void 0 ? mnemonic : '', password !== null && password !== void 0 ? password : '', network !== null && network !== void 0 ? network : '', blockChainConfigUrl !== null && blockChainConfigUrl !== void 0 ? blockChainConfigUrl : '', blockChainSocket5 !== null && blockChainSocket5 !== void 0 ? blockChainSocket5 : '', retry !== null && retry !== void 0 ? retry : '', timeOut !== null && timeOut !== void 0 ? timeOut : '', blockChainName !== null && blockChainName !== void 0 ? blockChainName : '', descriptor !== null && descriptor !== void 0 ? descriptor : '');
            return ok(wallet);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Sync wallet
     * @return {Promise<Result<string>>}
     */
    async syncWallet() {
        try {
            const response = await this._bdk.syncWallet();
            return ok(response);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Get new address
     * @return {Promise<Result<string>>}
     */
    async getNewAddress() {
        try {
            const address = await this._bdk.getNewAddress();
            return ok(address);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Get wallet balance
     * @return {Promise<Result<string>>}
     */
    async getBalance() {
        try {
            const balance = await this._bdk.getBalance();
            return ok(balance);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Broadcast Transaction
     * @return {Promise<Result<string>>}
     */
    async broadcastTx(args) {
        try {
            const { address, amount } = args;
            if (!_exists(address) || !_exists(amount))
                throw 'Required address or amount parameters are missing.';
            if (isNaN(amount))
                throw 'Entered amount is invalid';
            const tx = await this._bdk.broadcastTx(address, amount);
            return ok(tx);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Get pending transactions
     * @return {Promise<Result<Array<PendingTransaction>>>}
     */
    async getPendingTransactions() {
        try {
            const response = await this._bdk.getPendingTransactions();
            return ok(response);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Get pending transactions
     * @return {Promise<Result<Array<ConfirmedTransaction>>>}
     */
    async getConfirmedTransactions() {
        try {
            const response = await this._bdk.getConfirmedTransactions();
            return ok(response);
        }
        catch (e) {
            return err(e);
        }
    }
    /**
     * Get all transactions
     * @return {Promise<Result<TransactionsResponse>>}
     */
    async getTransactions() {
        try {
            const confirmed = await this._bdk.getConfirmedTransactions();
            const pending = await this._bdk.getPendingTransactions();
            const response = { confirmed, pending };
            return ok(response);
        }
        catch (e) {
            return err(e);
        }
    }
}
const BdkRn = new BdkInterface();
export default BdkRn;
//# sourceMappingURL=index.js.map