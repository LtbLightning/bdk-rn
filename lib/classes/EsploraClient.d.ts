import { NativeLoader } from './NativeLoader';
import { FullScanRequest, SyncRequest, Update } from './Bindings';
import { Transaction } from './Transaction';
export declare class EsploraClient extends NativeLoader {
    private id;
    private constructor();
    /**
     * Create a new EsploraClient instance
     * @param {string} url - The URL of the Esplora server
     * @returns {Promise<EsploraClient>}
     */
    static create(url: string): Promise<EsploraClient>;
    /**
     * Broadcast a transaction
     * @param {Transaction} transaction - The transaction to broadcast
     * @returns {Promise<void>}
     */
    broadcast(transaction: Transaction): Promise<void>;
    /**
     * Perform a full scan
     * @param {FullScanRequest} fullScanRequest - The full scan request
     * @param {number} stopGap - The stop gap
     * @param {number} parallelRequests - The number of parallel requests
     * @returns {Promise<Update>}
     */
    fullScan(fullScanRequest: FullScanRequest, stopGap: number, parallelRequests: number): Promise<Update>;
    /**
     * Synchronize the client
     * @param {SyncRequest} syncRequest - The sync request
     * @param {number} parallelRequests - The number of parallel requests
     * @returns {Promise<Update>}
     */
    sync(syncRequest: SyncRequest, parallelRequests: number): Promise<Update>;
}
