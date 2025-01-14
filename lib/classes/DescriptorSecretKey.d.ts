import { Network } from '../lib/enums';
import { DerivationPath } from './DerivationPath';
import { DescriptorPublicKey } from './DescriptorPublicKey';
import { Mnemonic } from './Mnemonic';
import { NativeLoader } from './NativeLoader';
/**
 * Descriptor Secret key methods
 */
export declare class DescriptorSecretKey extends NativeLoader {
    id: string;
    /**
     * Create a DescriptorSecretKey from network, mnemonic, and optional password
     * @param network
     * @param mnemonic
     * @param password
     * @returns {Promise<DescriptorSecretKey>}
     */
    create(network: Network, mnemonic: Mnemonic, password?: string): Promise<DescriptorSecretKey>;
    /**
     * Create a DescriptorSecretKey from a string representation
     * @param secretKey
     * @returns {Promise<DescriptorSecretKey>}
     */
    fromString(secretKey: string): Promise<DescriptorSecretKey>;
    /**
     * Derive a new DescriptorSecretKey from a derivation path
     * @param derivationPath
     * @returns {Promise<DescriptorSecretKey>}
     */
    derive(derivationPath: DerivationPath): Promise<DescriptorSecretKey>;
    /**
     * Extend the DescriptorSecretKey with a derivation path
     * @param derivationPath
     * @returns {Promise<DescriptorSecretKey>}
     */
    extend(derivationPath: DerivationPath): Promise<DescriptorSecretKey>;
    /**
     * Create a DescriptorPublicKey from this DescriptorSecretKey
     * @returns {Promise<DescriptorPublicKey>}
     */
    asPublic(): Promise<DescriptorPublicKey>;
    /**
     * Get the secret bytes of the DescriptorSecretKey
     * @returns {Promise<number[]>}
     */
    secretBytes(): Promise<number[]>;
    /**
     * Get the string representation of the DescriptorSecretKey
     * @returns {Promise<string>}
     */
    asString(): Promise<string>;
}
