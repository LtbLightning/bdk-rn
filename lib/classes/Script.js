import { NativeLoader } from './NativeLoader';
/**
 * Address script class
 */
export class Script extends NativeLoader {
    constructor(id) {
        super();
        this.id = id;
    }
    async toBytes() {
        return await this._bdk.toBytes(this.id);
    }
}
//# sourceMappingURL=Script.js.map