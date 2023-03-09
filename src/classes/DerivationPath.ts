import { NativeLoader } from './NativeLoader';

/**
 * A `BIP-32` derivation path
 */
export class DerivationPath extends NativeLoader {
  public id: string = '';

  /**
   * Verify derivation path
   * @param path
   * @returns {Promise<DerivationPath>}
   */
  async create(path: string): Promise<DerivationPath> {
    this.id = await this._bdk.createDerivationPath(path);
    return this;
  }
}
