import { NativeLoader } from './NativeLoader';
/**
 * A `BIP-32` derivation path
 */
class DerivationPathInterface extends NativeLoader {
    /**
     * Verify derivation path
     * @param path
     * @returns {Promise<DerivationPathInterface>}
     */
    async create(path) {
        await this._bdk.createDerivationPath(path);
        this.path = path;
        return this;
    }
    /**
     * @returns {string}
     */
    asString() {
        return this.path;
    }
}
export const DerivationPath = new DerivationPathInterface();
//# sourceMappingURL=DerivationPath.js.map