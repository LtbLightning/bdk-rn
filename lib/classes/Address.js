import { NativeLoader } from './NativeLoader';
import { Script } from './Script';
/**
 * Address methods
 */
export class Address extends NativeLoader {
    constructor() {
        super(...arguments);
        this.id = '';
    }
    /**
     * Create Address instance from address string
     * @param address
     * @param network
     * @returns {Promise<Address>}
     */
    static async create(address, network) {
        const instance = new Address();
        // Ensure _bdk is initialized before calling initAddress
        if (!instance._bdk) {
            throw new Error('BDK is not initialized');
        }
        instance.id = await instance._bdk.initAddress(address, network);
        return instance;
    }
    /**
     * Returns the script pub key of the Address object
     * @returns {Promise<Script>}
     */
    async scriptPubKey() {
        const scriptId = await this._bdk.addressToScriptPubkeyHex(this.id);
        return new Script(scriptId);
    }
    /**
     * Get the network of the address
     * @returns {Promise<Network>}
     */
    async network() {
        const networkString = await this._bdk.addressNetwork(this.id);
        return networkString;
    }
    /**
     * Get the QR URI representation of the address
     * @returns {Promise<string>}
     */
    async toQrUri() {
        return await this._bdk.addressToQrUri(this.id);
    }
    /**
     * Get the string representation of the address
     * @returns {Promise<string>}
     */
    async asString() {
        return await this._bdk.addressAsString(this.id);
    }
    /**
     * Check if the address is valid for the given network
     * @param network
     * @returns {Promise<boolean>}
     */
    async isValidForNetwork(network) {
        const addressString = await this.asString();
        return await this._bdk.addressIsValidForNetwork(addressString, network);
    }
    /**
     * Set Address id (internal use only)
     * @param id
     * @returns {Address}
     */
    _setAddress(id) {
        this.id = id;
        return this;
    }
}
//# sourceMappingURL=Address.js.map