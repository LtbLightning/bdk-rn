import { DescriptorPublicKey } from './DescriptorPublicKey';
import { Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Descriptor Secret key methods
 */
class DescriptorSecretKeyInterface extends NativeLoader {
    /**
     * Create xprv
     * @param network
     * @param mnemonic
     * @param password
     * @returns {Promise<DescriptorSecretKeyInterface>}
     */
    async create(network, mnemonic, password = '') {
        if (!Object.values(Network).includes(network))
            throw 'Invalid network passed';
        this.xprv = await this._bdk.createDescriptorSecret(network, mnemonic, password);
        return this;
    }
    /**
     * Derive xprv from derivation path
     * @param path
     * @returns {Promise<DescriptorSecretKeyInterface>}
     */
    async derive(path) {
        this.xprv = await this._bdk.descriptorSecretDerive(path);
        return this;
    }
    /**
     * Extend xprv from derivation path
     * @param path
     * @returns {Promise<DescriptorSecretKeyInterface>}
     */
    async extend(path) {
        this.xprv = await this._bdk.descriptorSecretExtend(path);
        return this;
    }
    /**
     * Create publicSecretKey from xprv
     * @returns {Promise<string>}
     */
    async asPublic() {
        let publicKey = await this._bdk.descriptorSecretAsPublic();
        DescriptorPublicKey.xpub = publicKey;
        return publicKey;
    }
    /**
     * Create secret bytes of xprv
     * @returns {Promise<Array<number>>}
     */
    async secretBytes() {
        return await this._bdk.descriptorSecretAsSecretBytes();
    }
    /**
     * Get secret key as string
     * @returns {string}
     */
    asString() {
        return this.xprv;
    }
}
export const DescriptorSecretKey = new DescriptorSecretKeyInterface();
//# sourceMappingURL=DescriptorSecretKey.js.map