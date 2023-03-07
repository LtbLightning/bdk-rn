import { Network } from '../lib/enums';
import { DescriptorPublicKey } from './DescriptorPublicKey';
import { NativeLoader } from './NativeLoader';
/**
 * Descriptor Secret key methods
 */
class DescriptorSecretKeyInterface extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
    }
    /**
     * Create xprv
     * @param network
     * @param mnemonic
     * @param password
     * @returns {Promise<DescriptorSecretKeyInterface>}
     */
    async create(network, mnemonic, password = '') {
        if (!Object.values(Network).includes(network)) {
            throw `Invalid network passed. Allowed values are ${Object.values(Network)}`;
        }
        this.id = await this._bdk.createDescriptorSecret(network, mnemonic, password);
        return this;
    }
    /**
     * Derive xprv from derivation path
     * @param path
     * @returns {Promise<DescriptorSecretKeyInterface>}
     */
    async derive(derivationPath) {
        await this._bdk.descriptorSecretDerive(this.id, derivationPath.id);
        return this;
    }
    /**
     * Extend xprv from derivation path
     * @param path
     * @returns {Promise<DescriptorSecretKeyInterface>}
     */
    async extend(derivationPath) {
        await this._bdk.descriptorSecretExtend(this.id, derivationPath.id);
        return this;
    }
    /**
     * Create publicSecretKey from xprv
     * @returns {Promise<string>}
     */
    async asPublic() {
        let pubkeyId = await this._bdk.descriptorSecretAsPublic(this.id);
        return await DescriptorPublicKey.create(pubkeyId);
    }
    /**
     * Create secret bytes of xprv
     * @returns {Promise<Array<number>>}
     */
    async secretBytes() {
        return await this._bdk.descriptorSecretAsSecretBytes(this.id);
    }
    /**
     * Get secret key as string
     * @returns {string}
     */
    async asString() {
        return await this._bdk.descriptorSecretAsString(this.id);
    }
}
export const DescriptorSecretKey = new DescriptorSecretKeyInterface();
//# sourceMappingURL=DescriptorSecretKey.js.map