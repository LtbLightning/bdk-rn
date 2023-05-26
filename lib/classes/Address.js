import { Script } from './Bindings';
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
    async scriptPubKey() {
        return new Script(await this._bdk.addressToScriptPubkeyHex(this.id));
    }
}
//# sourceMappingURL=Address.js.map