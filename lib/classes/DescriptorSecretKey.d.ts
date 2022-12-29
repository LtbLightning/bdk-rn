import { Network } from '../lib/enums';
import { NativeLoader } from './NativeLoader';
/**
 * Descriptor Secret key methods
 */
declare class DescriptorSecretKeyInterface extends NativeLoader {
    private xprv;
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
    derive(path: string): Promise<DescriptorSecretKeyInterface>;
    /**
     * Extend xprv from derivation path
     * @param path
     * @returns {Promise<DescriptorSecretKeyInterface>}
     */
    extend(path: string): Promise<DescriptorSecretKeyInterface>;
    /**
     * Create publicSecretKey from xprv
     * @returns {Promise<string>}
     */
    asPublic(): Promise<string>;
    /**
     * Create secret bytes of xprv
     * @returns {Promise<Array<number>>}
     */
    secretBytes(): Promise<Array<number>>;
    /**
     * Get secret key as string
     * @returns {string}
     */
    asString(): string | undefined;
}
export declare const DescriptorSecretKey: DescriptorSecretKeyInterface;
export {};
