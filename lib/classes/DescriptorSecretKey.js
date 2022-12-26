import { Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
class DescriptorSecretKeyInterface extends NativeLoader {
    async create(network, mnemonic, password = '') {
        if (!Object.values(Network).includes(network))
            throw 'Invalid network passed';
        this.xprv = await this._bdk.createDescriptorSecret(network, mnemonic, password);
        return this;
    }
    /**
     * @returns {string}
     */
    asString() {
        return this.xprv;
    }
}
export const DescriptorSecretKey = new DescriptorSecretKeyInterface();
//# sourceMappingURL=DescriptorSecretKey.js.map