import { NativeLoader } from './NativeLoader';
/**
 * A `BIP-32` derivation path
 */
class DerivationPathInterface extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
    }
    /**
     * Verify derivation path
     * @param path
     * @returns {Promise<DerivationPathInterface>}
     */
    async create(path) {
        this.id = await this._bdk.createDerivationPath(path);
        return this;
    }
}
export const DerivationPath = new DerivationPathInterface();
//# sourceMappingURL=DerivationPath.js.map