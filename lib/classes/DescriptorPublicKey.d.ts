import { NativeLoader } from './NativeLoader';
/**
 * Descriptor Public key methods
 */
declare class DescriptorPublicKeyInterface extends NativeLoader {
    xpub: string | undefined;
    /**
     * Create xpub
     * @returns {Promise<DescriptorPublicKeyInterface>}
     */
    create(): Promise<DescriptorPublicKeyInterface>;
    /**
     * Derive xpub from derivation path
     * @param path
     * @returns {Promise<DescriptorPublicKeyInterface>}
     */
    derive(path: string): Promise<DescriptorPublicKeyInterface>;
    /**
     * Extend xpub from derivation path
     * @param path
     * @returns {Promise<DescriptorPublicKeyInterface>}
     */
    extend(path: string): Promise<DescriptorPublicKeyInterface>;
    /**
     * Get public key as string
     * @returns {string}
     */
    asString(): string | undefined;
}
export declare const DescriptorPublicKey: DescriptorPublicKeyInterface;
export {};
