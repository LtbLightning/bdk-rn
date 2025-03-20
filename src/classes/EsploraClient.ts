import { NativeLoader } from './NativeLoader';
import { FullScanRequest, SyncRequest, Update } from './Bindings';
import { Transaction } from './Transaction';

export class EsploraClient extends NativeLoader {
  private id: string;

  private constructor(id: string) {
    super();
    this.id = id;
  }

  /**
   * Create a new EsploraClient instance
   * @param {string} url - The URL of the Esplora server
   * @returns {Promise<EsploraClient>}
   */
  static async create(url: string): Promise<EsploraClient> {
    const instance = new EsploraClient('');
    const id = await instance._bdk.createEsploraClient(url);
    instance.id = id;
    return instance;
  }

  /**
   * Broadcast a transaction
   * @param {Transaction} transaction - The transaction to broadcast
   * @returns {Promise<void>}
   */
  async broadcast(transaction: Transaction): Promise<void> {
    await this._bdk.esploraClientBroadcast(this.id, transaction.id);
  }

  /**
   * Perform a full scan
   * @param {FullScanRequest} fullScanRequest - The full scan request
   * @param {number} stopGap - The stop gap
   * @param {number} parallelRequests - The number of parallel requests
   * @returns {Promise<Update>}
   */
  async fullScan(fullScanRequest: FullScanRequest, stopGap: number, parallelRequests: number): Promise<Update> {
    const updateId = await this._bdk.esploraClientFullScan(this.id, fullScanRequest.id, stopGap, parallelRequests);
    return new Update(updateId);
  }

  /**
   * Synchronize the client
   * @param {SyncRequest} syncRequest - The sync request
   * @param {number} parallelRequests - The number of parallel requests
   * @returns {Promise<Update>}
   */
  async sync(syncRequest: SyncRequest, parallelRequests: number): Promise<Update> {
    const updateId = await this._bdk.esploraClientSync(this.id, syncRequest.id, parallelRequests);
    return new Update(updateId);
  }
}