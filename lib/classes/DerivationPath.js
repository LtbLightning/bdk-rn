import { NativeLoader } from './NativeLoader';
/**
 * A `BIP-32` derivation path
 */
export class DerivationPath extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
    }
    /**
     * Create a new DerivationPath instance
     * @param path The derivation path string
     * @returns {Promise<DerivationPath>}
     */
    async create(path) {
        this.id = await this._bdk.createDerivationPath(path);
        return this;
    }
}
//# sourceMappingURL=DerivationPath.js.map