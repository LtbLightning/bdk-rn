import { NativeLoader } from './NativeLoader';

export type ChainPosition = {
  type: 'confirmed' | 'unconfirmed';
  height?: number;
  timestamp: number;
};

/**
 * ChangeSpendPolicy methods
 */
export class ChangeSpendPolicy extends NativeLoader {
  isInit: boolean = false;
  id: string = '';

  /**
   * ChangeSpendPolicy constructor
   * @param position
   * @returns {Promise<ChangeSpendPolicy>}
   */
  async create(position: ChainPosition): Promise<ChangeSpendPolicy> {
    this.id = await this._bdk.createChainPosition(position);
    this.isInit = true;
    return this;
  }

  /**
   * Get the type of the ChainPosition
   * @returns {Promise<'confirmed' | 'unconfirmed'>}
   */
  async getType(): Promise<'confirmed' | 'unconfirmed'> {
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
  async getData(): Promise<ChainPosition> {
    const data = await this._bdk.getChainPositionData(this.id);
    return {
      type: data.height ? 'confirmed' : 'unconfirmed',
      ...data,
    };
  }

}