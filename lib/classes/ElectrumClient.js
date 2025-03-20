import { Update } from './Bindings';
import { NativeLoader } from './NativeLoader';
export class ElectrumClient extends NativeLoader {
    constructor(id) {
        super();
        this.id = id;
    }
    /**
     * Create a new ElectrumClient instance
     * @param {string} url - The URL of the Electrum server
     * @returns {Promise<ElectrumClient>}
     */
    static async create(url) {
        const instance = new ElectrumClient('');
        const id = await instance._bdk.createElectrumClient(url);
        instance.id = id;
        return instance;
    }
    /**
     * Broadcast a transaction
     * @param {Transaction} transaction - The transaction to broadcast
     * @returns {Promise<string>} - The transaction ID (txid)
     */
    async broadcast(transaction) {
        const result = await this._bdk.electrumClientBroadcast(this.id, transaction.id);
        if (typeof result === 'boolean') {
            throw new Error('Unexpected boolean result from electrumClientBroadcast');
        }
        return result;
    }
    /**
     * Perform a full scan
     * @param {FullScanRequest} fullScanRequest - The full scan request
     * @param {number} stopGap - The stop gap
     * @param {number} batchSize - The batch size
     * @param {boolean} fetchPrevTxouts - Whether to fetch previous transaction outputs
     * @returns {Promise<Update>} - The update result
     */
    async fullScan(fullScanRequest, stopGap, batchSize, fetchPrevTxouts) {
        const updateId = await this._bdk.electrumClientFullScan(this.id, fullScanRequest.id, stopGap, batchSize, fetchPrevTxouts);
        return new Update(updateId);
    }
    /**
     * Perform a sync operation
     * @param {SyncRequest} syncRequest - The sync request
     * @param {number} batchSize - The batch size
     * @param {boolean} fetchPrevTxouts - Whether to fetch previous transaction outputs
     * @returns {Promise<Update>} - The update result
     */
    async sync(syncRequest, batchSize, fetchPrevTxouts) {
        const updateId = await this._bdk.electrumClientSync(this.id, syncRequest.id, batchSize, fetchPrevTxouts);
        return new Update(updateId);
    }
}
//# sourceMappingURL=ElectrumClient.js.map