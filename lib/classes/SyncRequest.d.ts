import { NativeLoader } from './NativeLoader';
import { Wallet } from './Wallet';
export declare class SyncRequest extends NativeLoader {
    private id;
    private constructor();
    /**
     * Create a new SyncRequest instance
     * @param {Wallet} wallet - The wallet to create the sync request for
     * @returns {Promise<SyncRequest>}
     */
    static create(wallet: Wallet): Promise<SyncRequest>;
    /**
     * Free the SyncRequest instance
     * @returns {Promise<void>}
     */
    free(): Promise<void>;
    /**
     * Get the ID of the SyncRequest
     * @returns {string}
     */
    getId(): string;
}
