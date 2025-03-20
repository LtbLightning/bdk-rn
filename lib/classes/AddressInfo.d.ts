import { NativeLoader } from './NativeLoader';
import { Address, KeychainKind } from './Bindings';
export declare class AddressInfo extends NativeLoader {
    private id;
    private constructor();
    /**
     * Create a new AddressInfo instance
     * @param {number} index - The index of the address
     * @param {Address} address - The address object
     * @param {KeychainKind} keychain - The keychain kind
     * @returns {Promise<AddressInfo>}
     */
    static create(index: number, address: Address, keychain: KeychainKind): Promise<AddressInfo>;
    /**
     * Get the index of the address
     * @returns {Promise<number>}
     */
    getIndex(): Promise<number>;
    /**
     * Get the address
     * @returns {Promise<Address>}
     */
    getAddress(): Promise<Address>;
    /**
     * Get the keychain kind
     * @returns {Promise<KeychainKind>}
     */
    getKeychain(): Promise<KeychainKind>;
}
