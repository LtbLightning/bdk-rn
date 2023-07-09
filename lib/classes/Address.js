import { Script } from './Bindings';
import { getNetwork, getPayload } from '../lib/utils';
import { NativeLoader } from './NativeLoader';
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
     * @returns {Promise<Address>}
     */
    async create(address) {
        this.id = await this._bdk.initAddress(address);
        return this;
    }
    /**
     * Create Address instance from script
     * @param script
     * @returns {Promise<Address>}
     */
    async fromScript(script, network) {
        this.id = await this._bdk.addressFromScript(script.id, network);
        return this;
    }
    /**
     * Returns the script pub key of the [Address] object
     * @returns {Promise<Script>}
     */
    async scriptPubKey() {
        return new Script(await this._bdk.addressToScriptPubkeyHex(this.id));
    }
    /**
     * @returns {Promise<any>}
     */
    async payload() {
        return getPayload(await this._bdk.addressPayload(this.id));
    }
    /**
     * @returns {Promise<Network>}
     */
    async network() {
        let networkName = await this._bdk.addressNetwork(this.id);
        return getNetwork(networkName);
    }
    /**
     * @returns {Promise<string>}
     */
    async toQrUri() {
        return await this._bdk.addressToQrUri(this.id);
    }
    /**
     * @returns {Promise<string>}
     */
    async asString() {
        return await this._bdk.addressAsString(this.id);
    }
}
//# sourceMappingURL=Address.js.map