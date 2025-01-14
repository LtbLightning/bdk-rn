import { NativeLoader } from './NativeLoader';
import { Network } from '../lib/enums';
import { Script } from './Script';
/**
 * Address methods
 */
export declare class Address extends NativeLoader {
    private id;
    /**
     * Create Address instance from address string
     * @param address
     * @param network
     * @returns {Promise<Address>}
     */
    create(address: string, network: Network): Promise<Address>;
    /**
     * Returns the script pub key of the Address object
     * @returns {Promise<Script>}
     */
    scriptPubKey(): Promise<Script>;
    /**
     * Get the network of the address
     * @returns {Promise<Network>}
     */
    network(): Promise<Network>;
    /**
     * Get the QR URI representation of the address
     * @returns {Promise<string>}
     */
    toQrUri(): Promise<string>;
    /**
     * Get the string representation of the address
     * @returns {Promise<string>}
     */
    asString(): Promise<string>;
    /**
     * Check if the address is valid for the given network
     * @param network
     * @returns {Promise<boolean>}
     */
    isValidForNetwork(network: Network): Promise<boolean>;
    /**
     * Set Address id (internal use only)
     * @param id
     * @returns {Address}
     */
    _setAddress(id: string): Address;
}
