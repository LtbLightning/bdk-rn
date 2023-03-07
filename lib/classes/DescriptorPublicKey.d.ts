import { DerivationPath } from './DerivationPath';
import { NativeLoader } from './NativeLoader';
/**
 * Descriptor Public key methods
 */
declare class DescriptorPublicKeyInterface extends NativeLoader {
    id: string;
    xpub: string;
    /**
     * Create xpub
     * @returns {Promise<DescriptorPublicKeyInterface>}
     */
    create(publicKeyId: string): Promise<DescriptorPublicKeyInterface>;
    /**
     * Derive xpub from derivation path
     * @param path
     * @returns {Promise<DescriptorPublicKeyInterface>}
     */
    derive(derivationPath: typeof DerivationPath): Promise<DescriptorPublicKeyInterface>;
    /**
     * Extend xpub from derivation path
     * @param path
     * @returns {Promise<DescriptorPublicKeyInterface>}
     */
    extend(derivationPath: typeof DerivationPath): Promise<DescriptorPublicKeyInterface>;
    /**
     * Get public key as string
     * @returns {string}
     */
    asString(): Promise<string>;
}
export declare const DescriptorPublicKey: DescriptorPublicKeyInterface;
export {};
