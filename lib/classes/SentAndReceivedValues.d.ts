import { NativeLoader } from './NativeLoader';
import { Amount } from './Amount';
export declare class SentAndReceivedValues extends NativeLoader {
    sent: Amount;
    received: Amount;
    private constructor();
    /**
     * Create a new SentAndReceivedValues instance
     * @param {Amount} sent - The amount sent
     * @param {Amount} received - The amount received
     * @returns {Promise<SentAndReceivedValues>}
     */
    static create(sent: Amount, received: Amount): Promise<SentAndReceivedValues>;
    /**
     * Free the SentAndReceivedValues instance
     * @returns {Promise<void>}
     */
    free(): Promise<void>;
}
