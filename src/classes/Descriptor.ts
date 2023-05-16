import { KeychainKind, Network } from '../lib/enums';
import { DescriptorPublicKey } from './DescriptorPublicKey';
import { DescriptorSecretKey } from './DescriptorSecretKey';
import { NativeLoader } from './NativeLoader';

/**
 * Descriptor methods
 */
export class Descriptor extends NativeLoader {
  id: string = '';

  /**
   * Constructor
   * @param descriptor
   * @param network
   * @returns {Promise<Descriptor>}
   */
  async create(descriptor: string, network: Network): Promise<Descriptor> {
    if (!Object.values(Network).includes(network)) {
      throw `Invalid network passed. Allowed values are ${Object.values(Network)}`;
    }
    this.id = await this._bdk.createDescriptor(descriptor, network);
    return this;
  }

  /**
   * Return the public version of the output descriptor.
   * @returns {Promise<string>}
   */
  async asString(): Promise<string> {
    return this._bdk.descriptorAsString(this.id);
  }

  /**
   * Return the private version of the output descriptor if available, otherwise return the public version.
   * @returns {Promise<string>}
   */
  async asStringPrivate(): Promise<string> {
    return this._bdk.descriptorAsStringPrivate(this.id);
  }

  /**
   * BIP44 template. Expands to pkh(key/44'/{0,1}'/0'/{0,1}/*)
   * Since there are hardened derivation steps, this template requires a private derivable key (generally a xprv/tprv).
   * @returns {Promise<Descriptor>}
   */
  async newBip44(secretKey: DescriptorSecretKey, keychain: KeychainKind, network: Network): Promise<Descriptor> {
    this.id = await this._bdk.newBip44(secretKey.id, keychain, network);
    return this;
  }

  /**
   * BIP44 public template. Expands to pkh(key/{0,1}/*)
   * This assumes that the key used has already been derived with m/44'/0'/0' for Mainnet or m/44'/1'/0' for Testnet.
   * This template requires the parent fingerprint to populate correctly the metadata of PSBTs.
   * @returns {Promise<Descriptor>}
   */
  async newBip44Public(
    publicKey: DescriptorPublicKey,
    fingerprint: string,
    keychain: KeychainKind,
    network: Network
  ): Promise<Descriptor> {
    this.id = await this._bdk.newBip44Public(publicKey.id, fingerprint, keychain, network);
    return this;
  }

  /**
   * BIP49 template. Expands to sh(wpkh(key/49'/{0,1}'/0'/{0,1}/*))
   * Since there are hardened derivation steps, this template requires a private derivable key (generally a xprv/tprv).
   * @returns {Promise<Descriptor>}
   */
  async newBip49(secretKey: DescriptorSecretKey, keychain: KeychainKind, network: Network): Promise<Descriptor> {
    this.id = await this._bdk.newBip49(secretKey.id, keychain, network);
    return this;
  }

  /**
   * BIP49 public template. Expands to sh(wpkh(key/{0,1}/*))
   * This assumes that the key used has already been derived with m/49'/0'/0'.
   * This template requires the parent fingerprint to populate correctly the metadata of PSBTs.
   * @returns {Promise<Descriptor>}
   */
  async newBip49Public(
    publicKey: DescriptorPublicKey,
    fingerprint: string,
    keychain: KeychainKind,
    network: Network
  ): Promise<Descriptor> {
    this.id = await this._bdk.newBip49Public(publicKey.id, fingerprint, keychain, network);
    return this;
  }

  /**
   * BIP84 template. Expands to wpkh(key/84'/{0,1}'/0'/{0,1}/*)
   * Since there are hardened derivation steps, this template requires a private derivable key (generally a xprv/tprv).
   * @returns {Promise<Descriptor>}
   */
  async newBip84(secretKey: DescriptorSecretKey, keychain: KeychainKind, network: Network): Promise<Descriptor> {
    this.id = await this._bdk.newBip84(secretKey.id, keychain, network);
    return this;
  }

  /**
   * BIP84 public template. Expands to wpkh(key/{0,1}/*)
   * This assumes that the key used has already been derived with m/84'/0'/0'.
   * This template requires the parent fingerprint to populate correctly the metadata of PSBTs.
   * @returns {Promise<Descriptor>}
   */
  async newBip84Public(
    publicKey: DescriptorPublicKey,
    fingerprint: string,
    keychain: KeychainKind,
    network: Network
  ): Promise<Descriptor> {
    this.id = await this._bdk.newBip84Public(publicKey.id, fingerprint, keychain, network);
    return this;
  }
}
