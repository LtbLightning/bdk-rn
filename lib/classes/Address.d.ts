import { Network } from '../lib/enums';
import { PubkeyHash, Script, ScriptHash, WitnessProgram } from './Bindings';
import { NativeLoader } from './NativeLoader';
/**
 * Address methods
 */
export declare class Address extends NativeLoader {
    id: string;
    /**
     * Create Address instance from address string
     * @param address
     * @returns {Promise<Address>}
     */
    create(address: string): Promise<Address>;
    /**
     * Create Address instance from script
     * @param script
     * @returns {Promise<Address>}
     */
    fromScript(script: Script, network: Network): Promise<Address>;
    /**
     * Returns the script pub key of the [Address] object
     * @returns {Promise<Script>}
     */
    scriptPubKey(): Promise<Script>;
    /**
     * @returns {Promise<any>}
     */
    payload(): Promise<PubkeyHash | ScriptHash | WitnessProgram>;
    /**
     * @returns {Promise<Network>}
     */
    network(): Promise<Network>;
    /**
     * @returns {Promise<string>}
     */
    toQrUri(): Promise<string>;
    /**
     * @returns {Promise<string>}
     */
    asString(): Promise<string>;
}
