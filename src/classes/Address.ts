import { NativeLoader } from './NativeLoader';
import { Network } from '../lib/enums';
import { Script } from './Script';

/**
 * Address methods
 */
export class Address extends NativeLoader {
  private id: string = '';

  /**
   * Create Address instance from address string
   * @param address
   * @param network
   * @returns {Promise<Address>}
   */
  async create(address: string, network: Network): Promise<Address> {
    this.id = await this._bdk.initAddress(address, network);
    return this;
  }

  /**
   * Returns the script pub key of the Address object
   * @returns {Promise<Script>}
   */
  async scriptPubKey(): Promise<Script> {
    const scriptId = await this._bdk.addressToScriptPubkeyHex(this.id);
    return new Script(scriptId);
  }

  /**
   * Get the network of the address
   * @returns {Promise<Network>}
   */
  async network(): Promise<Network> {
    const networkString = await this._bdk.addressNetwork(this.id);
    return networkString as Network;
  }

  /**
   * Get the QR URI representation of the address
   * @returns {Promise<string>}
   */
  async toQrUri(): Promise<string> {
    return await this._bdk.addressToQrUri(this.id);
  }

  /**
   * Get the string representation of the address
   * @returns {Promise<string>}
   */
  async asString(): Promise<string> {
    return await this._bdk.addressAsString(this.id);
  }

  /**
   * Check if the address is valid for the given network
   * @param network
   * @returns {Promise<boolean>}
   */
  async isValidForNetwork(network: Network): Promise<boolean> {
    const addressString = await this.asString();
    return await this._bdk.addressIsValidForNetwork(addressString, network);
  }

  /**
   * Set Address id (internal use only)
   * @param id
   * @returns {Address}
   */
  _setAddress(id: string): Address {
    this.id = id;
    return this;
  }
}
