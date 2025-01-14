import { NativeLoader } from './NativeLoader';
/**
 * ChangeSpendPolicy methods
 */
export class ChangeSpendPolicy extends NativeLoader {
    constructor() {
        super(...arguments);
        this.isInit = false;
        this.id = '';
    }
    /**
     * ChangeSpendPolicy constructor
     * @param position
     * @returns {Promise<ChangeSpendPolicy>}
     */
    async create(position) {
        this.id = await this._bdk.createChainPosition(position);
        this.isInit = true;
        return this;
    }
    /**
     * Get the type of the ChainPosition
     * @returns {Promise<'confirmed' | 'unconfirmed'>}
     */
    async getType() {
        const result = await this._bdk.getChainPositionType(this.id);
        if (result !== 'confirmed' && result !== 'unconfirmed') {
            throw new Error(`Unexpected chain position type: ${result}`);
        }
        return result;
    }
    /**
     * Get the data of the ChainPosition
     * @returns {Promise<ChainPosition>}
     */
    async getData() {
        const data = await this._bdk.getChainPositionData(this.id);
        return {
            type: data.height ? 'confirmed' : 'unconfirmed',
            ...data,
        };
    }
}
//# sourceMappingURL=ChangeSpendPolicy.js.map