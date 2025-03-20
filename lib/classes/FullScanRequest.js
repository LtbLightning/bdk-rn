import { NativeLoader } from './NativeLoader';
export class FullScanRequest extends NativeLoader {
    constructor(id) {
        super();
        this.id = id;
    }
    /**
     * Create a new FullScanRequest instance
     * @param {Wallet} wallet - The wallet to create the full scan request for
     * @returns {Promise<FullScanRequest>}
     */
    static async create(wallet) {
        const instance = new FullScanRequest('');
        const id = await instance._bdk.createFullScanRequest(wallet.id);
        instance.id = id;
        return instance;
    }
    /**
     * Free the FullScanRequest instance
     * @returns {Promise<void>}
     */
    async free() {
        await this._bdk.freeFullScanRequest(this.id);
    }
    /**
     * Get the ID of the FullScanRequest
     * @returns {string}
     */
    getId() {
        return this.id;
    }
}
//# sourceMappingURL=FullScanRequest.js.map