import { FullScanRequest, SyncRequest, Update } from './Bindings';
import { NativeLoader } from './NativeLoader';
import { Transaction } from './Transaction';
export declare class ElectrumClient extends NativeLoader {
    private id;
    private constructor();
    /**
     * Create a new ElectrumClient instance
     * @param {string} url - The URL of the Electrum server
     * @returns {Promise<ElectrumClient>}
     */
    static create(url: string): Promise<ElectrumClient>;
    /**
     * Broadcast a transaction
     * @param {Transaction} transaction - The transaction to broadcast
     * @returns {Promise<string>} - The transaction ID (txid)
     */
    broadcast(transaction: Transaction): Promise<string>;
    /**
     * Perform a full scan
     * @param {FullScanRequest} fullScanRequest - The full scan request
     * @param {number} stopGap - The stop gap
     * @param {number} batchSize - The batch size
     * @param {boolean} fetchPrevTxouts - Whether to fetch previous transaction outputs
     * @returns {Promise<Update>} - The update result
     */
    fullScan(fullScanRequest: FullScanRequest, stopGap: number, batchSize: number, fetchPrevTxouts: boolean): Promise<Update>;
    /**
     * Perform a sync operation
     * @param {SyncRequest} syncRequest - The sync request
     * @param {number} batchSize - The batch size
     * @param {boolean} fetchPrevTxouts - Whether to fetch previous transaction outputs
     * @returns {Promise<Update>} - The update result
     */
    sync(syncRequest: SyncRequest, batchSize: number, fetchPrevTxouts: boolean): Promise<Update>;
}
