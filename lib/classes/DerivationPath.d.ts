import { NativeLoader } from './NativeLoader';
/**
 * A `BIP-32` derivation path
 */
declare class DerivationPathInterface extends NativeLoader {
    id: string;
    /**
     * Verify derivation path
     * @param path
     * @returns {Promise<DerivationPathInterface>}
     */
    create(path: string): Promise<DerivationPathInterface>;
}
export declare const DerivationPath: DerivationPathInterface;
export {};
