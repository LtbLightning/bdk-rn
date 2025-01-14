import { NativeLoader } from './NativeLoader';
import { Address } from './Bindings';
export class AddressInfo extends NativeLoader {
    constructor(id) {
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
    static async create(index, address, keychain) {
        const instance = new AddressInfo('');
        const id = await instance._bdk.createAddressInfo(index, address.id, keychain);
        instance.id = id;
        return instance;
    }
    /**
     * Get the index of the address
     * @returns {Promise<number>}
     */
    async getIndex() {
        return await this._bdk.getAddressInfoIndex(this.id);
    }
    /**
     * Get the address
     * @returns {Promise<Address>}
     */
    async getAddress() {
        const addressId = await this._bdk.getAddressInfoAddress(this.id);
        return new Address(addressId);
    }
    /**
     * Get the keychain kind
     * @returns {Promise<KeychainKind>}
     */
    async getKeychain() {
        const keychain = await this._bdk.getAddressInfoKeychain(this.id);
        return keychain;
    }
}
//# sourceMappingURL=AddressInfo.js.map