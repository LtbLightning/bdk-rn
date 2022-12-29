import { NativeLoader } from './NativeLoader';
/**
 * Wallet methods
 */
class WalletInterface extends NativeLoader {
    async init(descriptor, network) {
        let w = await this._bdk.initWallet(descriptor, network);
        console.log(w);
        return this;
    }
}
export const Wallet = new WalletInterface();
//# sourceMappingURL=Wallet.js.map