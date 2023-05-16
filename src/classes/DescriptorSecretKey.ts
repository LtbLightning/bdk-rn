import { Network } from '../lib/enums';
import { DerivationPath } from './DerivationPath';
import { DescriptorPublicKey } from './DescriptorPublicKey';
import { Mnemonic } from './Mnemonic';
import { NativeLoader } from './NativeLoader';

/**
 * Descriptor Secret key methods
 */
export class DescriptorSecretKey extends NativeLoader {
  public id: string = '';

  /**
   * Create xprv
   * @param network
   * @param mnemonic
   * @param password
   * @returns {Promise<DescriptorSecretKey>}
   */
  async create(network: Network, mnemonic: Mnemonic, password: string = ''): Promise<DescriptorSecretKey> {
    if (!Object.values(Network).includes(network)) {
      throw `Invalid network passed. Allowed values are ${Object.values(Network)}`;
    }
    this.id = await this._bdk.createDescriptorSecret(network, mnemonic.asString(), password);
    return this;
  }

  /**
   * Derive xprv from derivation path
   * @param path
   * @returns {Promise<DescriptorSecretKey>}
   */
  async derive(derivationPath: DerivationPath): Promise<string> {
    return await this._bdk.descriptorSecretDerive(this.id, derivationPath.id);
  }

  /**
   * Extend xprv from derivation path
   * @param path
   * @returns {Promise<DescriptorSecretKey>}
   */
  async extend(derivationPath: DerivationPath): Promise<string> {
    return await this._bdk.descriptorSecretExtend(this.id, derivationPath.id);
  }

  /**
   * Create publicSecretKey from xprv
   * @returns {Promise<string>}
   */
  async asPublic(): Promise<DescriptorPublicKey> {
    let pubkeyId = await this._bdk.descriptorSecretAsPublic(this.id);
    return new DescriptorPublicKey().create(pubkeyId);
  }

  /**
   * Create secret bytes of xprv
   * @returns {Promise<Array<number>>}
   */
  async secretBytes(): Promise<Array<number>> {
    return await this._bdk.descriptorSecretAsSecretBytes(this.id);
  }

  /**
   * Get secret key as string
   * @returns {string}
   */
  async asString(): Promise<string> {
    return await this._bdk.descriptorSecretAsString(this.id);
  }
}
