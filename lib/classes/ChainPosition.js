import { NativeLoader } from './NativeLoader';
export class ChainPosition extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
    }
    async create(position) {
        this.id = await this._bdk.createChainPosition(position);
        return this;
    }
    async getType() {
        return await this._bdk.getChainPositionType(this.id);
    }
    async getData() {
        return await this._bdk.getChainPositionData(this.id);
    }
}
//# sourceMappingURL=ChainPosition.js.map