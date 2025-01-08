import { NativeLoader } from './NativeLoader';

/**
 * A `BIP-32` derivation path
 */
export class DerivationPath extends NativeLoader {
  public id: string = '';

  /**
   * Create a new DerivationPath instance
   * @param path The derivation path string
   * @returns {Promise<DerivationPath>}
   */
  async create(path: string): Promise<DerivationPath> {
    this.id = await this._bdk.createDerivationPath(path);
    return this;
  }

  /**
   * Get the string representation of the derivation path
   * @returns {Promise<string>}
   */
  async toString(): Promise<string> {
    if (!this.id) {
      throw new Error('DerivationPath has not been initialized');
    }
    return await this._bdk.getDerivationPathAsString(this.id);
  }
}