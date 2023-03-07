import { NativeLoader } from './NativeLoader';

/**
 * A `BIP-32` derivation path
 */
class DerivationPathInterface extends NativeLoader {
  public id: string = '';

  /**
   * Verify derivation path
   * @param path
   * @returns {Promise<DerivationPathInterface>}
   */
  async create(path: string): Promise<DerivationPathInterface> {
    this.id = await this._bdk.createDerivationPath(path);
    return this;
  }
}

export const DerivationPath = new DerivationPathInterface();
