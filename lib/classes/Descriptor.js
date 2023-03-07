import { Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Descriptor methods
 */
class DescriptorInterface extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
    }
    /**
     * Constructor
     * @param descriptor
     * @param network
     * @returns {Promise<DescriptorInterface>}
     */
    async create(descriptor, network) {
        if (!Object.values(Network).includes(network)) {
            throw `Invalid network passed. Allowed values are ${Object.values(Network)}`;
        }
        this.id = await this._bdk.createDescriptor(descriptor, network);
        return this;
    }
    /**
     * Return the public version of the output descriptor.
     * @returns {Promise<string>}
     */
    async asString() {
        return this._bdk.descriptorAsString(this.id);
    }
    /**
     * Return the private version of the output descriptor if available, otherwise return the public version.
     * @returns {Promise<string>}
     */
    async asStringPrivate() {
        return this._bdk.descriptorAsStringPrivate(this.id);
    }
    /**
     * BIP44 template. Expands to pkh(key/44'/{0,1}'/0'/{0,1}/*)
     * Since there are hardened derivation steps, this template requires a private derivable key (generally a xprv/tprv).
     * @returns {Promise<DescriptorInterface>}
     */
    async newBip44(secretKey, keychain, network) {
        this.id = await this._bdk.newBip44(secretKey.id, keychain, network);
        return this;
    }
    /**
     * BIP49 template. Expands to sh(wpkh(key/49'/{0,1}'/0'/{0,1}/*))
     * Since there are hardened derivation steps, this template requires a private derivable key (generally a xprv/tprv).
     * @returns {Promise<DescriptorInterface>}
     */
    async newBip49(secretKey, keychain, network) {
        this.id = await this._bdk.newBip49(secretKey.id, keychain, network);
        return this;
    }
    /**
     * BIP84 template. Expands to wpkh(key/84'/{0,1}'/0'/{0,1}/*)
     * Since there are hardened derivation steps, this template requires a private derivable key (generally a xprv/tprv).
     * @returns {Promise<DescriptorInterface>}
     */
    async newBip84(secretKey, keychain, network) {
        this.id = await this._bdk.newBip84(secretKey.id, keychain, network);
        return this;
    }
}
export const Descriptor = new DescriptorInterface();
//# sourceMappingURL=Descriptor.js.map