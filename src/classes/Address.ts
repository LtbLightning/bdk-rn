import { Script } from './Bindings';
import { NativeLoader } from './NativeLoader';

/**
 * Address methods
 */
export class Address extends NativeLoader {
  id: string = '';

  /**
   * Create Address instance from address string
   * @param address
   * @returns {Promise<Address>}
   */
  async create(address: string): Promise<Address> {
    this.id = await this._bdk.initAddress(address);
    return this;
  }

  async scriptPubKey(): Promise<Script> {
    return new Script(await this._bdk.addressToScriptPubkeyHex(this.id));
  }
}
