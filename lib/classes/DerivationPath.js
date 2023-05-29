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
     * Verify derivation path
     * @param path
     * @returns {Promise<DerivationPath>}
     */
    async create(path) {
        this.id = await this._bdk.createDerivationPath(path);
        return this;
    }
}
//# sourceMappingURL=DerivationPath.js.map