import { NativeLoader } from './NativeLoader';
/**
 * A `BIP-32` derivation path
 */
export declare class DerivationPath extends NativeLoader {
    id: string;
    /**
     * Create a new DerivationPath instance
     * @param path The derivation path string
     * @returns {Promise<DerivationPath>}
     */
    create(path: string): Promise<DerivationPath>;
}
