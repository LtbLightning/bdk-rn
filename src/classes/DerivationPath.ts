import { NativeLoader } from './NativeLoader';

class DerivationPathInterface extends NativeLoader {
  private path: string | undefined;
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
