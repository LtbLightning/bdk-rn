import { NativeLoader } from './NativeLoader';
import { Address, KeychainKind } from './Bindings';

export class AddressInfo extends NativeLoader {
  private id: string;

  private constructor(id: string) {
    super();
    this.id = id;
  }

  /**
   * Create a new AddressInfo instance
   * @param {number} index - The index of the address
   * @param {Address} address - The address object
   * @param {KeychainKind} keychain - The keychain kind
   * @returns {Promise<AddressInfo>}
   */
  static async create(index: number, address: Address, keychain: KeychainKind): Promise<AddressInfo> {
    const instance = new AddressInfo('');
    const id = await instance._bdk.createAddressInfo(index, address.id, keychain);
    instance.id = id;
    return instance;
  }

  /**
   * Get the index of the address
   * @returns {Promise<number>}
   */
  async getIndex(): Promise<number> {
    return await this._bdk.getAddressInfoIndex(this.id);
  }

  /**
   * Get the address
   * @returns {Promise<Address>}
   */
  async getAddress(): Promise<Address> {
    const addressId = await this._bdk.getAddressInfoAddress(this.id);
    return new Address(addressId);
  }

  /**
   * Get the keychain kind
   * @returns {Promise<KeychainKind>}
   */
  async getKeychain(): Promise<KeychainKind> {
    const keychain = await this._bdk.getAddressInfoKeychain(this.id);
    return keychain as KeychainKind;
  }
}