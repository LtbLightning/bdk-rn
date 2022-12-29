import { NativeLoader } from './NativeLoader';

/**
 * A `BIP-32` derivation path
 */
class DerivationPathInterface extends NativeLoader {
  private path: string | undefined;

  /**
   * Verify derivation path
   * @param path
   * @returns {Promise<DerivationPathInterface>}
   */
  async create(path: string): Promise<DerivationPathInterface> {
    await this._bdk.createDerivationPath(path);
    this.path = path;
    return this;
  }

  /**
   * @returns {string}
   */
  asString(): string | undefined {
    return this.path;
  }
}

export const DerivationPath = new DerivationPathInterface();
