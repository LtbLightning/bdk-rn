import { DerivationPath } from './DerivationPath';
import { NativeLoader } from './NativeLoader';

/**
 * Descriptor Public key methods
 */
export class DescriptorPublicKey extends NativeLoader {
  public id: string = '';

  /**
   * Create descriptorPublic
   * @returns {DescriptorPublicKey}
   */
  create(publicKeyId: string): DescriptorPublicKey {
    this.id = publicKeyId;
    return this;
  }

  /**
   * Create descriptorPublic from public key string
   * @returns {Promise<DescriptorPublicKey>}
   */
  async fromString(publicKey: string): Promise<DescriptorPublicKey> {
    this.id = await this._bdk.createDescriptorPublic(publicKey);
    return this;
  }

  /**
   * Derive descriptorPublic from derivation path
   * @param path
   * @returns {Promise<DescriptorPublicKey>}
   */
  async derive(derivationPath: DerivationPath): Promise<string> {
    return await this._bdk.descriptorPublicDerive(this.id, derivationPath.id);
  }

  /**
   * Extend descriptorPublic from derivation path
   * @param path
   * @returns {Promise<DescriptorPublicKey>}
   */
  async extend(derivationPath: DerivationPath): Promise<string> {
    return await this._bdk.descriptorPublicExtend(this.id, derivationPath.id);
  }

  /**
   * Get public key as string
   * @returns {string}
   */
  async asString(): Promise<string> {
    return await this._bdk.descriptorPublicAsString(this.id);
  }

  /**
   * Get public key as bytes
   * @returns {Promise<Array<number>>}
   */
  async asBytes(): Promise<Array<number>> {
    return await this._bdk.descriptorPublicKeyAsBytes(this.id);
  }
}
