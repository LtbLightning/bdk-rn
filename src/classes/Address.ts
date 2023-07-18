import { PubkeyHash, ScriptHash, WitnessProgram } from './Bindings';
import { getNetwork, getPayload } from '../lib/utils';

import { NativeLoader } from './NativeLoader';
import { Network } from '../lib/enums';
import { Script } from './Script';

/**
 * Address methods
 */
export class Address extends NativeLoader {
  id: string = '';

  /**
   * Set Address
   * @returns {Address}
   */
  _setAddress(id: string): Address {
    this.id = id;
    return this;
  }

  /**
   * Create Address instance from address string
   * @param address
   * @returns {Promise<Address>}
   */
  async create(address: string): Promise<Address> {
    this.id = await this._bdk.initAddress(address);
    return this;
  }

  /**
   * Create Address instance from script
   * @param script
   * @returns {Promise<Address>}
   */
  async fromScript(script: Script, network: Network): Promise<Address> {
    this.id = await this._bdk.addressFromScript(script.id, network);
    return this;
  }

  /**
   * Returns the script pub key of the [Address] object
   * @returns {Promise<Script>}
   */
  async scriptPubKey(): Promise<Script> {
    return new Script(await this._bdk.addressToScriptPubkeyHex(this.id));
  }

  /**
   * @returns {Promise<any>}
   */
  async payload(): Promise<PubkeyHash | ScriptHash | WitnessProgram> {
    return getPayload(await this._bdk.addressPayload(this.id));
  }

  /**
   * @returns {Promise<Network>}
   */
  async network(): Promise<Network> {
    let networkName = await this._bdk.addressNetwork(this.id);
    return getNetwork(networkName);
  }

  /**
   * @returns {Promise<string>}
   */
  async toQrUri(): Promise<string> {
    return await this._bdk.addressToQrUri(this.id);
  }

  /**
   * @returns {Promise<string>}
   */
  async asString(): Promise<string> {
    return await this._bdk.addressAsString(this.id);
  }
}
