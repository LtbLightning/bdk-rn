import { NativeLoader } from './NativeLoader';
export class SentAndReceivedValues extends NativeLoader {
    constructor(sent, received) {
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
    static async create(sent, received) {
        const instance = new SentAndReceivedValues(sent, received);
        return instance;
    }
    /**
     * Free the SentAndReceivedValues instance
     * @returns {Promise<void>}
     */
    async free() {
        await this._bdk.freeSentAndReceivedValues(this);
    }
}
//# sourceMappingURL=SentAndReceivedValues.js.map