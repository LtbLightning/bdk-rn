import { NativeLoader } from './NativeLoader';
/**
 * Descriptor Public key methods
 */
export class DescriptorPublicKey extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
    }
    /**
     * Create descriptorPublic
     * @returns {DescriptorPublicKey}
     */
    create(publicKeyId) {
        this.id = publicKeyId;
        return this;
    }
    /**
     * Create descriptorPublic from public key string
     * @returns {Promise<DescriptorPublicKey>}
     */
    async fromString(publicKey) {
        this.id = await this._bdk.createDescriptorPublic(publicKey);
        return this;
    }
    /**
     * Derive descriptorPublic from derivation path
     * @param path
     * @returns {Promise<DescriptorPublicKey>}
     */
    async derive(derivationPath) {
        return await this._bdk.descriptorPublicDerive(this.id, derivationPath.id);
    }
    /**
     * Extend descriptorPublic from derivation path
     * @param path
     * @returns {Promise<DescriptorPublicKey>}
     */
    async extend(derivationPath) {
        return await this._bdk.descriptorPublicExtend(this.id, derivationPath.id);
    }
    /**
     * Get public key as string
     * @returns {string}
     */
    async asString() {
        return await this._bdk.descriptorPublicAsString(this.id);
    }
}
//# sourceMappingURL=DescriptorPublicKey.js.map