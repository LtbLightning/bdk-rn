import { NativeLoader } from './NativeLoader';
import { Wallet } from './Wallet';
export declare class FullScanRequest extends NativeLoader {
    private id;
    private constructor();
    /**
     * Create a new FullScanRequest instance
     * @param {Wallet} wallet - The wallet to create the full scan request for
     * @returns {Promise<FullScanRequest>}
     */
    static create(wallet: Wallet): Promise<FullScanRequest>;
    /**
     * Free the FullScanRequest instance
     * @returns {Promise<void>}
     */
    free(): Promise<void>;
    /**
     * Get the ID of the FullScanRequest
     * @returns {string}
     */
    getId(): string;
}
