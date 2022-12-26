import { NativeLoader } from './NativeLoader';
class DerivationPathInterface extends NativeLoader {
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