import { NativeLoader } from './NativeLoader';
import { Wallet } from './Wallet';

export class FullScanRequest extends NativeLoader {
  private id: string;

  private constructor(id: string) {
    super();
    this.id = id;
  }

  /**
   * Create a new FullScanRequest instance
   * @param {Wallet} wallet - The wallet to create the full scan request for
   * @returns {Promise<FullScanRequest>}
   */
  static async create(wallet: Wallet): Promise<FullScanRequest> {
    const instance = new FullScanRequest('');
    const id = await instance._bdk.createFullScanRequest(wallet.id);
    instance.id = id;
    return instance;
  }

  /**
   * Free the FullScanRequest instance
   * @returns {Promise<void>}
   */
  async free(): Promise<void> {
    await this._bdk.freeFullScanRequest(this.id);
  }

  /**
   * Get the ID of the FullScanRequest
   * @returns {string}
   */
  getId(): string {
    return this.id;
  }
}
