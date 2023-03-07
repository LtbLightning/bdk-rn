import { DerivationPath } from './DerivationPath';
import { Network } from '../lib/enums';
import { DescriptorPublicKey } from './DescriptorPublicKey';
import { NativeLoader } from './NativeLoader';
/**
 * Descriptor Secret key methods
 */
declare class DescriptorSecretKeyInterface extends NativeLoader {
    id: string;
    /**
     * Create xprv
     * @param network
     * @param mnemonic
     * @param password
     * @returns {Promise<DescriptorSecretKeyInterface>}
     */
    create(network: Network, mnemonic: string, password?: string): Promise<DescriptorSecretKeyInterface>;
    /**
     * Derive xprv from derivation path
     * @param path
     * @returns {Promise<DescriptorSecretKeyInterface>}
     */
    derive(derivationPath: typeof DerivationPath): Promise<DescriptorSecretKeyInterface>;
    /**
     * Extend xprv from derivation path
     * @param path
     * @returns {Promise<DescriptorSecretKeyInterface>}
     */
    extend(derivationPath: typeof DerivationPath): Promise<DescriptorSecretKeyInterface>;
    /**
     * Create publicSecretKey from xprv
     * @returns {Promise<string>}
     */
    asPublic(): Promise<typeof DescriptorPublicKey>;
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
export declare const DescriptorSecretKey: DescriptorSecretKeyInterface;
export {};
