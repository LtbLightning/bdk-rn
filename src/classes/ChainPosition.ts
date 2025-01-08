import { NativeLoader } from './NativeLoader';

export interface ChainPositionData {
  height?: number;
  timestamp: number;
}

export class ChainPosition extends NativeLoader {
  id: string = '';

  async create(position: ChainPositionData): Promise<ChainPosition> {
    this.id = await this._bdk.createChainPosition(position);
    return this;
  }

  async getType(): Promise<string> {
    return await this._bdk.getChainPositionType(this.id);
  }

  async getData(): Promise<ChainPositionData> {
    return await this._bdk.getChainPositionData(this.id);
  }
}
