import { NativeLoader } from './NativeLoader';
/**
 * Descriptor Public key methods
 */
class DescriptorPublicKeyInterface extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
        this.xpub = '';
    }
    /**
     * Create xpub
     * @returns {Promise<DescriptorPublicKeyInterface>}
     */
    async create(publicKeyId) {
        this.id = publicKeyId;
        return this;
    }
    /**
     * Derive xpub from derivation path
     * @param path
     * @returns {Promise<DescriptorPublicKeyInterface>}
     */
    async derive(derivationPath) {
        await this._bdk.descriptorPublicDerive(this.id, derivationPath.id);
        return this;
    }
    /**
     * Extend xpub from derivation path
     * @param path
     * @returns {Promise<DescriptorPublicKeyInterface>}
     */
    async extend(derivationPath) {
        await this._bdk.descriptorPublicExtend(this.id, derivationPath.id);
        return this;
    }
    /**
     * Get public key as string
     * @returns {string}
     */
    async asString() {
        return await this._bdk.descriptorPublicAsString(this.id);
    }
}
export const DescriptorPublicKey = new DescriptorPublicKeyInterface();
//# sourceMappingURL=DescriptorPublicKey.js.map