import { NativeLoader } from './NativeLoader';
import { Amount } from './Amount';

export class SentAndReceivedValues extends NativeLoader {
  public sent: Amount;
  public received: Amount;

  private constructor(sent: Amount, received: Amount) {
    super();
    this.sent = sent;
    this.received = received;
  }

  /**
   * Create a new SentAndReceivedValues instance
   * @param {Amount} sent - The amount sent
   * @param {Amount} received - The amount received
   * @returns {Promise<SentAndReceivedValues>}
   */
  static async create(sent: Amount, received: Amount): Promise<SentAndReceivedValues> {
    const instance = new SentAndReceivedValues(sent, received);
    return instance;
  }

  /**
   * Free the SentAndReceivedValues instance
   * @returns {Promise<void>}
   */
  async free(): Promise<void> {
    await this._bdk.freeSentAndReceivedValues(this);
  }
}
