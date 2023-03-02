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
}
export const Descriptor = new DescriptorInterface();
//# sourceMappingURL=Descriptor.js.map