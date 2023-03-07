import { DerivationPath } from './DerivationPath';
import { NativeLoader } from './NativeLoader';

/**
 * Descriptor Public key methods
 */
class DescriptorPublicKeyInterface extends NativeLoader {
  public id: string = '';
  public xpub: string = '';

  /**
   * Create xpub
   * @returns {Promise<DescriptorPublicKeyInterface>}
   */
  async create(publicKeyId: string): Promise<DescriptorPublicKeyInterface> {
    this.id = publicKeyId;
    return this;
  }

  /**
   * Derive xpub from derivation path
   * @param path
   * @returns {Promise<DescriptorPublicKeyInterface>}
   */
  async derive(derivationPath: typeof DerivationPath): Promise<DescriptorPublicKeyInterface> {
    await this._bdk.descriptorPublicDerive(this.id, derivationPath.id);
    return this;
  }

  /**
   * Extend xpub from derivation path
   * @param path
   * @returns {Promise<DescriptorPublicKeyInterface>}
   */
  async extend(derivationPath: typeof DerivationPath): Promise<DescriptorPublicKeyInterface> {
    await this._bdk.descriptorPublicExtend(this.id, derivationPath.id);
    return this;
  }

  /**
   * Get public key as string
   * @returns {string}
   */
  async asString(): Promise<string> {
    return await this._bdk.descriptorPublicAsString(this.id);
  }
}

export const DescriptorPublicKey = new DescriptorPublicKeyInterface();
