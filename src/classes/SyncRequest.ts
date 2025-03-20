import { NativeLoader } from './NativeLoader';
import { Wallet } from './Wallet';

export class SyncRequest extends NativeLoader {
  private id: string;

  private constructor(id: string) {
    super();
    this.id = id;
  }

  /**
   * Create a new SyncRequest instance
   * @param {Wallet} wallet - The wallet to create the sync request for
   * @returns {Promise<SyncRequest>}
   */
  static async create(wallet: Wallet): Promise<SyncRequest> {
    const instance = new SyncRequest('');
    const id = await instance._bdk.createSyncRequest(wallet.id);
    instance.id = id;
    return instance;
  }

  /**
   * Free the SyncRequest instance
   * @returns {Promise<void>}
   */
  async free(): Promise<void> {
    await this._bdk.freeSyncRequest(this.id);
  }

  /**
   * Get the ID of the SyncRequest
   * @returns {string}
   */
  getId(): string {
    return this.id;
  }
}