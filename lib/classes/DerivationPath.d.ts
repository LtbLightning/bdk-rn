import { NativeLoader } from './NativeLoader';
/**
 * A `BIP-32` derivation path
 */
export declare class DerivationPath extends NativeLoader {
    id: string;
    /**
     * Verify derivation path
     * @param path
     * @returns {Promise<DerivationPath>}
     */
    create(path: string): Promise<DerivationPath>;
}
