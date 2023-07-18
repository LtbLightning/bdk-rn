import { NativeLoader } from './NativeLoader';

/**
 * Address script class
 */
export class Script extends NativeLoader {
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  async toBytes(): Promise<Array<number>> {
    return await this._bdk.toBytes(this.id);
  }
}
