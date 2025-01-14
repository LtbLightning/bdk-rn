import { Network } from '../lib/enums';
import { DescriptorPublicKey } from './DescriptorPublicKey';
import { NativeLoader } from './NativeLoader';
/**
 * Descriptor Secret key methods
 */
export class DescriptorSecretKey extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
    }
    /**
     * Create a DescriptorSecretKey from network, mnemonic, and optional password
     * @param network
     * @param mnemonic
     * @param password
     * @returns {Promise<DescriptorSecretKey>}
     */
    async create(network, mnemonic, password = '') {
        if (!Object.values(Network).includes(network)) {
            throw `Invalid network passed. Allowed values are ${Object.values(Network)}`;
        }
        this.id = await this._bdk.createDescriptorSecretKey(network, mnemonic.asString(), password);
        return this;
    }
    /**
     * Create a DescriptorSecretKey from a string representation
     * @param secretKey
     * @returns {Promise<DescriptorSecretKey>}
     */
    async fromString(secretKey) {
        this.id = await this._bdk.descriptorSecretKeyFromString(secretKey);
        return this;
    }
    /**
     * Derive a new DescriptorSecretKey from a derivation path
     * @param derivationPath
     * @returns {Promise<DescriptorSecretKey>}
     */
    async derive(derivationPath) {
        const newId = await this._bdk.descriptorSecretKeyDerive(this.id, await derivationPath.toString());
        const newKey = new DescriptorSecretKey();
        newKey.id = newId;
        return newKey;
    }
    /**
     * Extend the DescriptorSecretKey with a derivation path
     * @param derivationPath
     * @returns {Promise<DescriptorSecretKey>}
     */
    async extend(derivationPath) {
        const newId = await this._bdk.descriptorSecretKeyExtend(this.id, await derivationPath.toString());
        const newKey = new DescriptorSecretKey();
        newKey.id = newId;
        return newKey;
    }
    /**
     * Create a DescriptorPublicKey from this DescriptorSecretKey
     * @returns {Promise<DescriptorPublicKey>}
     */
    async asPublic() {
        const pubkeyId = await this._bdk.descriptorSecretKeyAsPublic(this.id);
        return new DescriptorPublicKey().create(pubkeyId);
    }
    /**
     * Get the secret bytes of the DescriptorSecretKey
     * @returns {Promise<number[]>}
     */
    async secretBytes() {
        return await this._bdk.descriptorSecretKeySecretBytes(this.id);
    }
    /**
     * Get the string representation of the DescriptorSecretKey
     * @returns {Promise<string>}
     */
    async asString() {
        return await this._bdk.descriptorSecretKeyAsString(this.id);
    }
}
//# sourceMappingURL=DescriptorSecretKey.js.map