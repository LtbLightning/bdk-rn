import { NativeLoader } from './NativeLoader';
export class SyncRequest extends NativeLoader {
    constructor(id) {
        super();
        this.id = id;
    }
    /**
     * Create a new SyncRequest instance
     * @param {Wallet} wallet - The wallet to create the sync request for
     * @returns {Promise<SyncRequest>}
     */
    static async create(wallet) {
        const instance = new SyncRequest('');
        const id = await instance._bdk.createSyncRequest(wallet.id);
        instance.id = id;
        return instance;
    }
    /**
     * Free the SyncRequest instance
     * @returns {Promise<void>}
     */
    async free() {
        await this._bdk.freeSyncRequest(this.id);
    }
    /**
     * Get the ID of the SyncRequest
     * @returns {string}
     */
    getId() {
        return this.id;
    }
}
//# sourceMappingURL=SyncRequest.js.map