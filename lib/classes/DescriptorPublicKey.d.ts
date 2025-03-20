import { DerivationPath } from './DerivationPath';
import { NativeLoader } from './NativeLoader';
/**
 * Descriptor Public key methods
 */
export declare class DescriptorPublicKey extends NativeLoader {
    id: string;
    /**
     * Create descriptorPublic
     * @returns {DescriptorPublicKey}
     */
    create(publicKeyId: string): DescriptorPublicKey;
    /**
     * Create descriptorPublic from public key string
     * @returns {Promise<DescriptorPublicKey>}
     */
    fromString(publicKey: string): Promise<DescriptorPublicKey>;
    /**
     * Derive descriptorPublic from derivation path
     * @param path
     * @returns {Promise<DescriptorPublicKey>}
     */
    derive(derivationPath: DerivationPath): Promise<string>;
    /**
     * Extend descriptorPublic from derivation path
     * @param path
     * @returns {Promise<DescriptorPublicKey>}
     */
    extend(derivationPath: DerivationPath): Promise<string>;
    /**
     * Get public key as string
     * @returns {string}
     */
    asString(): Promise<string>;
    /**
     * Get public key as bytes
     * @returns {Promise<Array<number>>}
     */
    asBytes(): Promise<Array<number>>;
}
