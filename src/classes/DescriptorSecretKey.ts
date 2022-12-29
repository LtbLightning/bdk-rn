import { Network } from '../lib/enums';
import { DescriptorPublicKey } from './DescriptorPublicKey';
import { NativeLoader } from './NativeLoader';

/**
 * Descriptor Secret key methods
 */
class DescriptorSecretKeyInterface extends NativeLoader {
  private xprv: string | undefined;

  /**
   * Create xprv
   * @param network
   * @param mnemonic
   * @param password
   * @returns {Promise<DescriptorSecretKeyInterface>}
   */
  async create(network: Network, mnemonic: string, password: string = ''): Promise<DescriptorSecretKeyInterface> {
    if (!Object.values(Network).includes(network)) {
      throw `Invalid network passed. Allowed values are ${Object.values(Network)}`;
    }
    this.xprv = await this._bdk.createDescriptorSecret(network, mnemonic, password);
    return this;
  }

  /**
   * Derive xprv from derivation path
   * @param path
   * @returns {Promise<DescriptorSecretKeyInterface>}
   */
  async derive(path: string): Promise<DescriptorSecretKeyInterface> {
    this.xprv = await this._bdk.descriptorSecretDerive(path);
    return this;
  }

  /**
   * Extend xprv from derivation path
   * @param path
   * @returns {Promise<DescriptorSecretKeyInterface>}
   */
  async extend(path: string): Promise<DescriptorSecretKeyInterface> {
    this.xprv = await this._bdk.descriptorSecretExtend(path);
    return this;
  }

  /**
   * Create publicSecretKey from xprv
   * @returns {Promise<string>}
   */
  async asPublic(): Promise<string> {
    let publicKey = await this._bdk.descriptorSecretAsPublic();
    DescriptorPublicKey.xpub = publicKey;
    return publicKey;
  }

  /**
   * Create secret bytes of xprv
   * @returns {Promise<Array<number>>}
   */
  async secretBytes(): Promise<Array<number>> {
    return await this._bdk.descriptorSecretAsSecretBytes();
  }

  /**
   * Get secret key as string
   * @returns {string}
   */
  asString(): string | undefined {
    return this.xprv;
  }
}

export const DescriptorSecretKey = new DescriptorSecretKeyInterface();
