import { NativeLoader } from './NativeLoader';
/**
 * Descriptor Public key methods
 */
class DescriptorPublicKeyInterface extends NativeLoader {
    /**
     * Create xpub
     * @returns {Promise<DescriptorPublicKeyInterface>}
     */
    async create() {
        this.xpub = await this._bdk.createDescriptorPublic(this.xpub);
        return this;
    }
    /**
     * Derive xpub from derivation path
     * @param path
     * @returns {Promise<DescriptorPublicKeyInterface>}
     */
    async derive(path) {
        this.xpub = await this._bdk.descriptorSecretDerive(path);
        return this;
    }
    /**
     * Extend xpub from derivation path
     * @param path
     * @returns {Promise<DescriptorPublicKeyInterface>}
     */
    async extend(path) {
        this.xpub = await this._bdk.descriptorSecretExtend(path);
        return this;
    }
    /**
     * Get public key as string
     * @returns {string}
     */
    asString() {
        return this.xpub;
    }
}
export const DescriptorPublicKey = new DescriptorPublicKeyInterface();
//# sourceMappingURL=DescriptorPublicKey.js.map