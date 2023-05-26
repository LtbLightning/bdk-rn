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
     * Create xprv
     * @param network
     * @param mnemonic
     * @param password
     * @returns {Promise<DescriptorSecretKey>}
     */
    create(network: Network, mnemonic: Mnemonic, password?: string): Promise<DescriptorSecretKey>;
    /**
     * Derive xprv from derivation path
     * @param path
     * @returns {Promise<DescriptorSecretKey>}
     */
    derive(derivationPath: DerivationPath): Promise<string>;
    /**
     * Extend xprv from derivation path
     * @param path
     * @returns {Promise<DescriptorSecretKey>}
     */
    extend(derivationPath: DerivationPath): Promise<string>;
    /**
     * Create publicSecretKey from xprv
     * @returns {Promise<string>}
     */
    asPublic(): Promise<DescriptorPublicKey>;
    /**
     * Create secret bytes of xprv
     * @returns {Promise<Array<number>>}
     */
    secretBytes(): Promise<Array<number>>;
    /**
     * Get secret key as string
     * @returns {string}
     */
    asString(): Promise<string>;
}
