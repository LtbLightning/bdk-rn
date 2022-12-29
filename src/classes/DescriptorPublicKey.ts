import { NativeLoader } from './NativeLoader';

/**
 * Descriptor Public key methods
 */
class DescriptorPublicKeyInterface extends NativeLoader {
  public xpub: string | undefined;

  /**
   * Create xpub
   * @returns {Promise<DescriptorPublicKeyInterface>}
   */
  async create(): Promise<DescriptorPublicKeyInterface> {
    this.xpub = await this._bdk.createDescriptorPublic(this.xpub as string);
    return this;
  }

  /**
   * Derive xpub from derivation path
   * @param path
   * @returns {Promise<DescriptorPublicKeyInterface>}
   */
  async derive(path: string): Promise<DescriptorPublicKeyInterface> {
    this.xpub = await this._bdk.descriptorSecretDerive(path);
    return this;
  }

  /**
   * Extend xpub from derivation path
   * @param path
   * @returns {Promise<DescriptorPublicKeyInterface>}
   */
  async extend(path: string): Promise<DescriptorPublicKeyInterface> {
    this.xpub = await this._bdk.descriptorSecretExtend(path);
    return this;
  }

  /**
   * Get public key as string
   * @returns {string}
   */
  asString(): string | undefined {
    return this.xpub;
  }
}

export const DescriptorPublicKey = new DescriptorPublicKeyInterface();
