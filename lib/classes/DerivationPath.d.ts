import { NativeLoader } from './NativeLoader';
/**
 * A `BIP-32` derivation path
 */
declare class DerivationPathInterface extends NativeLoader {
    private path;
    /**
     * Verify derivation path
     * @param path
     * @returns {Promise<DerivationPathInterface>}
     */
    create(path: string): Promise<DerivationPathInterface>;
    /**
     * @returns {string}
     */
    asString(): string | undefined;
}
export declare const DerivationPath: DerivationPathInterface;
export {};
